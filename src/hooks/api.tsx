/* eslint-disable react-hooks/exhaustive-deps */
import { ApiPromise } from '@polkadot/api';
import { Button, notification } from 'antd';
import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkIds } from '../config';
import { AccountType, Action, IAccountMeta, NetworkType } from '../model';
import {
  connectEth,
  connectNodeProvider,
  ConnectStatus,
  connectSubstrate,
  isNetworkConsistent,
} from '../utils/api/connect';

interface StoreState {
  accountType: AccountType;
  accounts: IAccountMeta[];
  network: NetworkType;
  networkStatus: ConnectStatus; // FIXME unused now;
}

type ActionType = 'switchAccountType' | 'switchNetwork' | 'updateNetworkStatus' | 'setAccounts';

const initialState: StoreState = {
  accountType: 'main',
  network: 'pangolin',
  accounts: null,
  networkStatus: 'pending',
};

// tslint:disable-next-line: cyclomatic-complexity no-any
export function accountReducer(state: StoreState, action: Action<ActionType, any>): StoreState {
  switch (action.type) {
    case 'switchAccountType': {
      return { ...state, accounts: null, accountType: action.payload as AccountType };
    }

    case 'switchNetwork': {
      return { ...state, network: action.payload as NetworkType };
    }

    case 'setAccounts': {
      return { ...state, accounts: action.payload };
    }

    case 'updateNetworkStatus': {
      return { ...state, networkStatus: action.payload };
    }

    default:
      return state;
  }
}

export type ApiCtx = {
  accountType: AccountType;
  accounts: IAccountMeta[];
  api: ApiPromise;
  createAction: ActionHelper;
  dispatch: Dispatch<Action<ActionType>>;
  network: NetworkType;
  networkStatus: ConnectStatus;
  setAccounts: (accounts: IAccountMeta[]) => void;
  setNetworkStatus: (status: ConnectStatus) => void;
  switchAccountType: (type: AccountType) => void;
  switchNetwork: (type: NetworkType) => void;
};

type ActionHelper = <T = string>(type: ActionType) => (payload: T) => void;

export const ApiContext = createContext<ApiCtx>(null);

export const ApiProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const createAction: ActionHelper = (type) => (payload) =>
    dispatch({ type, payload: payload as never });
  const switchAccountType = useCallback(createAction<AccountType>('switchAccountType'), []);
  const switchNetwork = useCallback(createAction<NetworkType>('switchNetwork'), []);
  const setAccounts = useCallback(createAction<IAccountMeta[]>('setAccounts'), []);
  const setNetworkStatus = useCallback(createAction<ConnectStatus>('updateNetworkStatus'), []);
  const [api, setApi] = useState<ApiPromise>(null);
  const { t } = useTranslation();
  const connectToEth = useCallback(async () => {
    const { accounts: newAccounts } = await connectEth(state.network);

    setAccounts(newAccounts);

    const metamaskAccountChanged = (accounts: string[]) => {
      setAccounts(accounts.map((address) => ({ address })));
    };

    window.ethereum.on('accountsChanged', metamaskAccountChanged);
    // TODO any other event to handle, e.g: disconnect
    window.ethereum.on('disconnect', () => {});
  }, []);

  /**
   * connect to substrate or metamask when account type changed.
   */
  useEffect(() => {
    // tslint:disable-next-line: cyclomatic-complexity
    (async () => {
      setNetworkStatus('connecting');
      try {
        if (state.accountType === 'main') {
          const { accounts: newAccounts, api: newApi, extensions } = await connectSubstrate(
            state.network
          );

          setApi(newApi);

          if (!extensions.length && !newAccounts.length) {
            setAccounts(null);
          } else {
            setAccounts(newAccounts);
          }
        }

        if (state.accountType === 'smart') {
          const isConsistent = await isNetworkConsistent(state.network);

          if (!isConsistent) {
            const key = `key${Date.now()}`;

            notification.error({
              message: t('Incorrect network'),
              description: t('Network is not consistent! Please switch to {{type}} in metamask', {
                type: state.network,
              }),
              btn: (
                <Button type='primary' onClick={() => notification.close(key)}>
                  {t('I known')}
                </Button>
              ),
              key,
              onClose: () => notification.close(key),
              // tslint:disable-next-line: no-magic-numbers
              duration: 10 * 1000,
            });

            setNetworkStatus('fail');

            // FIXME: should cancel listening after component destroy ?
            window.ethereum.on('chainChanged', (chainId: string) => {
              const id = parseInt(chainId, 16).toString();

              if (id === NetworkIds[state.network]) {
                connectToEth();
              }
            });

            return;
          }

          connectToEth();
        }

        setNetworkStatus('success');
      } catch (error) {
        setNetworkStatus('fail');
      }
    })();

    return () => {};
  }, [state.accountType]);

  /**
   * disconnect api connections;
   */
  useEffect(() => {
    (async () => {
      if (api) {
        await api.disconnect();
        setApi(null);
      }
    })();
  }, [state.network]);

  /**
   * reset node provider on mainnet as soon as network changed.
   */
  useEffect(() => {
    (async () => {
      setNetworkStatus('connecting');
      if (state.accountType === 'main') {
        const newApi = await connectNodeProvider(state.network);

        setApi(newApi);
      }
      setNetworkStatus('success');
    })();
  }, [state.network]);

  return (
    <ApiContext.Provider
      value={{
        ...state,
        dispatch,
        createAction,
        switchAccountType,
        switchNetwork,
        setNetworkStatus,
        setAccounts,
        api,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext) as Exclude<ApiCtx, null>;
