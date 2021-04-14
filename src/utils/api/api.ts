import { typesBundleForPolkadot } from '@darwinia/types/mix';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import { message } from 'antd';
import Bignumber from 'bignumber.js';
import BN from 'bn.js';
import { TFunction } from 'i18next';
import Web3 from 'web3';
import { DVM_KTON_WITHDRAW_ADDRESS, NetworkIds, TOKEN_ERC20_KTON } from '../../config';
import { AccountType, IAccountMeta, NetworkConfig, NetworkType } from '../../model';
import { precisionBalance } from '../format/formatBalance';
import ktonABI from './abi/ktonABI.json';

export interface Connection {
  accounts: ExtType.InjectedAccountWithMeta[];
  api: ApiPromise | null;
  networkStatus: ConnectStatus;
}

export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail';

export type TokenBalance = [string, string];

const RPC_CONFIG: NetworkConfig<string> = {
  crab: 'wss://crab.darwinia.network',
  darwinia: 'wss://rpc.darwinia.network',
  pangolin: 'wss://pangolin-rpc.darwinia.network/',
};

// const darwiniaApi: ApiPromise | null = null;

export async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise> {
  const provider = new WsProvider(RPC_CONFIG[type]);
  const darwiniaApi = await ApiPromise.create({
    provider,
    typesBundle: {
      spec: {
        /* tslint:disable */
        Crab: typesBundleForPolkadot.spec.crab as any,
        Pangolin: typesBundleForPolkadot.spec.pangolin as any,
        Darwinia: typesBundleForPolkadot.spec.darwinia as any,
        /* tslint:enable */
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
    const extensions = await web3Enable(enable); // TODO: ?
    const accounts = await web3Accounts();
    const api = await connectNodeProvider(network);

    return { accounts, extensions, api };
  } catch (err) {
    console.log('%c [ err ]-52', 'font-size:13px; background:pink; color:#bf2c9f;', err);
  }
}

export function isMetamaskInstalled(): boolean {
  return typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined';
}

export async function isNetworkConsistent(network: NetworkType): Promise<boolean> {
  // id 1: eth mainnet 3: ropsten 4: rinkeby 5: goerli 42: kovan  43: pangolin
  const actualId = await window.ethereum.request({ method: 'net_version' });

  return NetworkIds[network] === actualId;
}

export async function connectEth(network: NetworkType): Promise<{ accounts: IAccountMeta[] }> {
  if (!isMetamaskInstalled) {
    console.error('You must install metamask first!');
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
    /* tslint:disable */
    const ringUsableBalance = await (api?.rpc as any).balances.usableBalance(0, account);
    const ktonUsableBalance = await (api?.rpc as any).balances.usableBalance(1, account);
    /* tslint:enable */

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
    const connect = accountType === 'main' ? connectSubstrate : connectEth;

    indicator('connecting');

    connect(network)
      .then(({ accounts }) => {
        successFn(accounts);
        indicator('success');
      })
      .catch((error) => {
        console.log('%c [ error ]-50', 'font-size:13px; background:pink; color:#bf2c9f;', error);
        message.error(t('Error occurs during connect to {{type}} network.', { type: network }));
      });
  };
}

export async function getTokenBalanceEth(account = ''): Promise<TokenBalance> {
  try {
    const web3 = new Web3(window.ethereum);
    const ring = await web3.eth.getBalance(account);
    // tslint:disable-next-line: no-any
    const ktonContract = new web3.eth.Contract(ktonABI as any, TOKEN_ERC20_KTON, { gas: 55000 });
    const kton = await ktonContract.methods.balanceOf(account).call();

    return [ring, kton];
  } catch (error) {
    console.log('%c [ error ]-144', 'font-size:13px; background:pink; color:#bf2c9f;', error);
    return ['0', '0'];
  }
}

/**
 * @param account receive account - metamask current active account;
 * @param amount receive amount
 * @returns transaction hash
 */
export async function receiveKton(account: string, amount: BN): Promise<string> {
  // ?FIXE: use code below after contract updated.
  // const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  // const ktonContract = new web3.eth.Contract(x16ABI as any, TOKEN_ERC20_KTON);
  // const result = await ktonContract.methods
  //   .transfer_and_call(
  //     TOKEN_ERC20_KTON,
  //     web3.utils.toWei(amount)
  //   )
  //   .send({ from: account });

  const valueLength = 64;
  const balance = precisionBalance(amount.toString());
  const count = new Bignumber(balance).toString(16);
  // tslint:disable-next-line: no-magic-numbers
  const value = new Array(valueLength - count.length).fill(0).join('') + count;
  // tslint:disable-next-line: no-magic-numbers
  const data = `0x784deab5000000000000000000000000${TOKEN_ERC20_KTON.slice(2)}${value}`;
  const web3 = new Web3(window.ethereum);
  const txHash = await web3.eth.sendTransaction({
    from: account,
    to: DVM_KTON_WITHDRAW_ADDRESS,
    data,
    value: '0x00',
    gas: 300000,
  });

  return txHash.transactionHash;
}
