/* eslint-disable react-hooks/exhaustive-deps */
import { ApiPromise } from '@polkadot/api';
import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { AccountType, IAccountMeta, NetworkType } from '../model';
import {
  connectEth,
  connectNodeProvider,
  ConnectStatus,
  connectSubstrate,
} from '../utils/api/connect';

interface StoreState {
  accountType: AccountType;
  accounts: IAccountMeta[];
  network: NetworkType;
  networkStatus: ConnectStatus; // FIXME unused now;
}

type ActionType = 'switchAccountType' | 'switchNetwork' | 'updateNetworkStatus' | 'setAccounts';

interface Action<T = string> {
  type: ActionType;
  payload: T;
}

const store: StoreState = {
  accountType: 'main',
  network: 'pangolin',
  accounts: null,
  networkStatus: 'pending',
};

// tslint:disable-next-line: cyclomatic-complexity no-any
export function accountReducer(state: StoreState, action: Action<any>): StoreState {
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
  dispatch: Dispatch<Action>;
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
  const [state, dispatch] = useReducer(accountReducer, store);
  const createAction: ActionHelper = (type) => (payload) =>
    dispatch({ type, payload: payload as never });
  const switchAccountType = useCallback(createAction<AccountType>('switchAccountType'), []);
  const switchNetwork = useCallback(createAction<NetworkType>('switchNetwork'), []);
  const setAccounts = useCallback(createAction<IAccountMeta[]>('setAccounts'), []);
  const setNetworkStatus = useCallback(createAction<ConnectStatus>('updateNetworkStatus'), []);
  const [api, setApi] = useState<ApiPromise>(null);

  useEffect(() => {
    let metamaskAccountChanged: (accounts: string[]) => void;

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
            setAccounts(null); // FIXME: if refresh the page, extensions and accounts all empty
          } else {
            setAccounts(newAccounts);
          }
        }

        if (state.accountType === 'smart') {
          const { accounts: newAccounts } = await connectEth();

          setAccounts(newAccounts);

          metamaskAccountChanged = (accounts: string[]) => {
            setAccounts(accounts.map((address) => ({ address })));
          };

          window.ethereum.on('accountsChanged', metamaskAccountChanged);
          // TODO any other event to handle, e.g: disconnect
          window.ethereum.on('disconnect', () => {});
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
