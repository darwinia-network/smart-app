/* eslint-disable react-hooks/exhaustive-deps */
import { ApiPromise } from '@polkadot/api';
import type ExtType from '@polkadot/extension-inject/types';
import { connect } from 'node:http2';
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
import { AccountType, NetworkType } from '../model';
import {
  connectFactory,
  connectNodeProvider,
  ConnectStatus,
  connectSubstrate,
} from '../utils/api/connect';

interface StoreState {
  account: string;
  from: AccountType;
  network: NetworkType;
  accounts: ExtType.InjectedAccountWithMeta[];
  networkStatus: ConnectStatus; // FIXME unused now;
}

type ActionType =
  | 'setAccount'
  | 'switchFrom'
  | 'switchNetwork'
  | 'updateNetworkStatus'
  | 'setAccounts';

interface Action<T = string> {
  type: ActionType;
  payload: T;
}

const store: StoreState = {
  account: null,
  from: 'main',
  network: 'pangolin',
  accounts: null,
  networkStatus: 'pending',
};

// tslint:disable-next-line: cyclomatic-complexity no-any
export function accountReducer(state: StoreState, action: Action<any>): StoreState {
  switch (action.type) {
    case 'setAccount': {
      return {
        ...state,
        account: action.payload,
        from: action.payload?.startsWith('0x') ? 'smart' : 'main',
      };
    }

    case 'switchFrom': {
      return { ...state, account: null, accounts: null, from: action.payload as AccountType };
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
type ActionHelper = <T = string>(type: ActionType) => (payload: T) => void;

export type AccountCtx = StoreState & {
  dispatch: Dispatch<Action>;
  createAction: ActionHelper;
  setAccount: (account: string) => void;
  switchFrom: (from: AccountType) => void;
  switchNetwork: (type: NetworkType) => void;
  setAccounts: (accounts: ExtType.InjectedAccountWithMeta[]) => void;
  setNetworkStatus: (status: ConnectStatus) => void;
  api: ApiPromise;
};

export const AccountContext = createContext<AccountCtx>(null);

export const AccountProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(accountReducer, store);
  const createAction: ActionHelper = (type) => (payload) =>
    dispatch({ type, payload: payload as never });
  const setAccount = useCallback(createAction('setAccount'), []);
  const switchFrom = useCallback(createAction<AccountType>('switchFrom'), []);
  const switchNetwork = useCallback(createAction<NetworkType>('switchNetwork'), []);
  const setAccounts = useCallback(
    createAction<ExtType.InjectedAccountWithMeta[]>('setAccounts'),
    []
  );
  const setNetworkStatus = useCallback(createAction<ConnectStatus>('updateNetworkStatus'), []);
  const [api, setApi] = useState<ApiPromise>(null);

  useEffect(() => {
    (async () => {
      setNetworkStatus('connecting');
      try {
        if (state.from === 'main') {
          const { accounts, api: newApi } = await connectSubstrate(state.network);
          setApi(newApi);
          setAccounts(accounts);
        }
        setNetworkStatus('success');
      } catch (error) {
        setNetworkStatus('fail');
      }
    })();
  }, [state.from]);

  useEffect(() => {
    (async () => {
      setNetworkStatus('connecting');
      try {
        if (window.darwiniaApi) {
          await window.darwiniaApi.disconnect();
          window.darwiniaApi = null;
        }
        if (state.from === 'main') {
          const newApi = await connectNodeProvider(state.network);
          setApi(newApi);
        }
        setNetworkStatus('success');
      } catch (error) {
        setNetworkStatus('fail');
      }
    })();
  }, [state.network]);

  return (
    <AccountContext.Provider
      value={{
        ...state,
        dispatch,
        createAction,
        setAccount,
        switchFrom,
        switchNetwork,
        setAccounts,
        setNetworkStatus,
        api,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext) as Exclude<AccountCtx, null>;
