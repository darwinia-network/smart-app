import { typesBundleForPolkadot } from '@darwinia/types/mix';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import { NetworkConfig, NetworkType } from '../../model';

declare global {
  interface Window {
    darwiniaApi: ApiPromise | null;
  }
}
export interface Connection {
  accounts: ExtType.InjectedAccountWithMeta[];
  api: ApiPromise | null;
  networkStatus: ConnectStatus;
}

export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail';

const RPC_CONFIG: NetworkConfig<string> = {
  crab: 'wss://crab.darwinia.network',
  main: 'wss://rpc.darwinia.network',
  darwinia: 'wss://rpc.darwinia.network',
  pangolin: 'wss://pangolin-rpc.darwinia.network/',
};

// const darwiniaApi: ApiPromise | null = null;

export async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise> {
  try {
    if (!window.darwiniaApi) {
      const provider = new WsProvider(RPC_CONFIG[type]);

      window.darwiniaApi = await ApiPromise.create({
        provider,
        typesBundle: {
          spec: {
            Crab: typesBundleForPolkadot.spec.crab as any,
            Pangolin: typesBundleForPolkadot.spec.pangolin as any,
            Darwinia: typesBundleForPolkadot.spec.darwinia as any,
          },
        },
      });
      await window.darwiniaApi.isReady;

      return window.darwiniaApi;
    }
  } catch (error) {
    console.log(error);
  }

  return window.darwiniaApi;
}

export async function connectSubstrate(enable = 'polkadot-js/apps') {
  try {
    const allInjected = await web3Enable(enable); // TODO: ?
    const accounts = await web3Accounts();

    await connectNodeProvider('pangolin');

    return { accounts, allInjected };
  } catch (err) {
    console.log('%c [ err ]-52', 'font-size:13px; background:pink; color:#bf2c9f;', err);
  }
}

// tslint:disable-next-line: cyclomatic-complexity
export async function connectEth() {
  return Promise.resolve({ accounts: [] });
}

export async function getTokenBalanceDarwinia(account = ''): Promise<[string, string]> {
  try {
    // await window.darwiniaApi?.isReady;
    // type = 0 query ring balance.  type = 1 query kton balance.
    const ringUsableBalance = await (window.darwiniaApi?.rpc as any).balances.usableBalance(
      0,
      account
    );
    const ktonUsableBalance = await (window.darwiniaApi?.rpc as any).balances.usableBalance(
      1,
      account
    );

    return [ringUsableBalance.usableBalance.toString(), ktonUsableBalance.usableBalance.toString()];
  } catch (error) {
    console.log('%c [ error ]-65', 'font-size:13px; background:pink; color:#bf2c9f;', error);

    return ['0', '0'];
  }
}
