/* eslint-disable react-hooks/exhaustive-deps */
import type ExtType from '@polkadot/extension-inject/types';
import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { connectNodeProvider, ConnectStatus } from '../hooks/connect';
import { AccountType, NetworkType } from '../model';

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

// tslint:disable-next-line: cyclomatic-complexity
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

  useEffect(() => {
    console.log(
      '%c [ state.network ]-101',
      'font-size:13px; background:pink; color:#bf2c9f;',
      state.network
    );

    connectNodeProvider(state.network).then(() => {
      console.log('%c [api is ready] ', 'color:blue');
    });
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
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext) as Exclude<AccountCtx, null>;
