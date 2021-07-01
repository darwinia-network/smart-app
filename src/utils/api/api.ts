import { typesBundleForPolkadot } from '@darwinia/types/mix';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import { message } from 'antd';
import BN from 'bn.js';
import { TFunction } from 'i18next';
import Web3 from 'web3';
import { NETWORK_CONFIG } from '../../config';
import { AccountType, IAccountMeta, NetworkType } from '../../model';
import ktonABI from './abi/ktonABI.json';
import precompileABI from './abi/precompileABI.json';

export interface Connection {
  accounts: ExtType.InjectedAccountWithMeta[];
  api: ApiPromise | null;
  networkStatus: ConnectStatus;
}

export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail' | 'disconnected';

export type TokenBalance = [string, string];

interface DepositKtonOptions {
  withdrawAddress: string;
  erc20Address: string;
  isManually?: boolean;
}

export async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise> {
  const provider = new WsProvider(NETWORK_CONFIG[type].rpc);
  const darwiniaApi = await ApiPromise.create({
    provider,
    typesBundle: {
      spec: {
        /* eslint-disable */
        Crab: typesBundleForPolkadot.spec.crab as any,
        Pangolin: typesBundleForPolkadot.spec.pangolin as any,
        Darwinia: typesBundleForPolkadot.spec.darwinia as any,
        /* eslint-enable */
      },
    },
  });

  await darwiniaApi.isReady;

  return darwiniaApi;
}

export async function connectSubstrate(
  network: NetworkType,
  enable = 'polkadot-js/apps'
): Promise<{
  accounts: ExtType.InjectedAccountWithMeta[];
  extensions: ExtType.InjectedExtension[];
  api: ApiPromise;
}> {
  try {
    const extensions = await web3Enable(enable);
    const accounts = await web3Accounts();
    const api = await connectNodeProvider(network);

    return { accounts, extensions, api };
  } catch (err) {
    // do nothing;
  }
}

export function isMetamaskInstalled(): boolean {
  return typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined';
}

export async function isNetworkConsistent(network: NetworkType, id?: string): Promise<boolean> {
  id = Web3.utils.isHex(id) ? parseInt(id, 16).toString() : id;
  // id 1: eth mainnet 3: ropsten 4: rinkeby 5: goerli 42: kovan  43: pangolin 44: crab
  const actualId: string = id
    ? await Promise.resolve(id)
    : await window.ethereum.request({ method: 'net_version' });

  return parseInt(NETWORK_CONFIG[network].ethereumChain.chainId, 16).toString() === actualId;
}

export async function connectEth(_: NetworkType): Promise<{ accounts: IAccountMeta[] }> {
  if (!isMetamaskInstalled) {
    return;
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });

  const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });

  return {
    accounts: accounts.map((address) => ({ address })),
  };
}

export async function getTokenBalanceDarwinia(
  api: ApiPromise,
  account = ''
): Promise<TokenBalance> {
  try {
    await api?.isReady;
    // type = 0 query ring balance.  type = 1 query kton balance.
    /* eslint-disable */
    const ringUsableBalance = await (api?.rpc as any).balances.usableBalance(0, account);
    const ktonUsableBalance = await (api?.rpc as any).balances.usableBalance(1, account);
    /* eslint-enable */

    return [ringUsableBalance.usableBalance.toString(), ktonUsableBalance.usableBalance.toString()];
  } catch (error) {
    return ['0', '0'];
  }
}

export function connectFactory(
  successFn: (accounts: IAccountMeta[]) => void,
  t: TFunction,
  indicator?: (status: ConnectStatus) => void
): (network: NetworkType, accountType: AccountType) => Promise<void> {
  return async (network: NetworkType, accountType: AccountType) => {
    const connect = accountType === 'substrate' ? connectSubstrate : connectEth;

    indicator('connecting');

    connect(network)
      .then(({ accounts }) => {
        successFn(accounts);
        indicator('success');
      })
      .catch((error) => {
        message.error(t('Unable to connect to {{type}} network.', { type: network }));
        console.error(error.message);
        indicator('fail');
      });
  };
}

export async function getTokenBalanceEth(ktonAddress: string, account = ''): Promise<TokenBalance> {
  const web3 = new Web3(window.ethereum);
  let ring = '0';
  let kton = '0';

  try {
    ring = await web3.eth.getBalance(account);
  } catch (error) {
    console.error(
      '%c [ get ring balance in ethereum error ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error.message
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ktonContract = new web3.eth.Contract(ktonABI as any, ktonAddress, { gas: 55000 });

    kton = await ktonContract.methods.balanceOf(account).call();
  } catch (error) {
    console.error(
      '%c [ get kton balance in ethereum error ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error.message
    );
  }

  return [ring, kton];
}

/**
 * !FIXME transfer_and_call error: `TxGasUti - Trying to call a function on a noo-contract address`,
 * but actually the deposit action is success.
 *
 * @param account - metamask current active account;
 * @returns transaction hash
 */
export async function depositKtonByPrecompileContract(
  account: string,
  amount: BN,
  { withdrawAddress, erc20Address, isManually = false }: DepositKtonOptions
): Promise<string> {
  const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const precompileContract = new web3.eth.Contract(precompileABI as any, withdrawAddress);
  let params: Record<string, string | number> = { from: account };

  if (!isManually) {
    const data = web3.eth.abi.encodeParameters(
      ['address', 'uint256'],
      [erc20Address, amount.toString()]
    );
    const gasEstimated = await web3.eth.estimateGas({
      to: withdrawAddress,
      // eslint-disable-next-line no-magic-numbers
      data: '0x3225da29' + data.substr(2),
    });
    params = { ...params, gas: gasEstimated };
  }

  let txHash;

  try {
    txHash = await precompileContract.methods.transfer_and_call(erc20Address, amount).send(params);
  } catch (error) {
    console.warn(
      '%c [ error ]-182',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error.message
    );
  }

  return txHash.transactionHash;
}

/**
 * @description add chain in metamask
 */
export async function addEthereumChain(network: NetworkType) {
  const params = NETWORK_CONFIG[network].ethereumChain;

  try {
    const result = await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    });

    return result;
  } catch (err) {
    console.warn('%c [ err ]-199', 'font-size:13px; background:pink; color:#bf2c9f;', err);
  }
}

/**
 * @param account receive account - metamask current active account;
 * @param amount receive amount
 * @returns transaction hash
 */
export async function depositKton(
  account: string,
  amount: BN,
  { withdrawAddress, erc20Address }: DepositKtonOptions
): Promise<string> {
  const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  const result = web3.eth.abi.encodeParameters(
    ['address', 'uint256'],
    [erc20Address, amount.toString()]
  );
  // eslint-disable-next-line no-magic-numbers
  const data = '0x3225da29' + result.substr(2);
  const gas = 100000;

  const txHash = await web3.eth.sendTransaction({
    from: account,
    to: withdrawAddress,
    data,
    value: '0x00',
    gas,
  });

  return txHash.transactionHash;
}
