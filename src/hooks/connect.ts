import { ApiPromise, WsProvider } from '@darwinia/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_TYPE } from '../config/network';
import { NetworkConfig, NetworkType } from '../model';

declare global {
  interface Window {
    darwiniaApi: ApiPromise | null;
  }
}

export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail';

const RPC_CONFIG: NetworkConfig<string> = {
  crab: 'wss://crab.darwinia.network',
  main: 'wss://rpc.darwinia.network',
  darwinia: 'wss://rpc.darwinia.network',
  pangolin: 'wss://pangolin-rpc.darwinia.network/',
};

let darwiniaApi: ApiPromise | null = null;

async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise | null> {
  try {
    // if (!window.darwiniaApi) {
    const provider = new WsProvider(RPC_CONFIG[type]);
    const network = NETWORK_TYPE[type];

    // Create the API and wait until ready
    darwiniaApi = new ApiPromise({ provider, types: network });
    // tslint:disable-next-line: no-string-literal
    // window['darwiniaApi'] = darwiniaApi;
    const isReady = await darwiniaApi.isReady;

    return isReady;
    // } else {
    //   return window.darwiniaApi;
    // }
  } catch (error) {
    console.error(error);

    return null;
  }
}

async function connectSubstrate(enable = 'polkadot-js/apps') {
  try {
    const allInjected = await web3Enable(enable); // TODO: ?
    const accounts = await web3Accounts();

    return { accounts, allInjected };
  } catch (err) {
    console.log('%c [ err ]-52', 'font-size:13px; background:pink; color:#bf2c9f;', err);

    throw new Error('xx');
  }
}

export function useConnect(options?: {
  enable?: string;
}): {
  accounts: ExtType.InjectedAccountWithMeta[];
  api: ApiPromise | null;
  status: ConnectStatus;
  setNetwork: (type: NetworkType) => void;
} {
  const [network, setNetwork] = useState<NetworkType | null>(null);
  const [status, setStatus] = useState<ConnectStatus>('pending');
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [accounts, setAccounts] = useState<ExtType.InjectedAccountWithMeta[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    connectSubstrate(options?.enable)
      .then((res) => {
        setStatus('success');
        setAccounts(res.accounts);
      })
      .catch((err) => {
        message.error(t('Error occurs during connect to {{type}} network.', { type: network }));
        console.warn('%c [ err ]-85', 'font-size:13px; background:pink; color:#bf2c9f;', err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (!network) {
      return;
    }

    const reconnect = () =>
      connectNodeProvider(network)
        .then(setApi)
        .catch((err) => {
          message.error(t('Error occurs during {{type}} RPC connecting', { type: network }));
          console.error('%c [ err ]-106', 'font-size:13px; background:pink; color:#bf2c9f;', err);
        });

    if (!!api) {
      api.disconnect().then(reconnect);
    } else {
      reconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  return { status, api, accounts, setNetwork };
}
