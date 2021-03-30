/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, Dispatch, useCallback, useContext, useReducer } from 'react';
import { AccountType, NetworkType } from '../model';
interface StoreState {
  account: string;
  from: AccountType;
  network: NetworkType;
}

type ActionType = 'setAccount' | 'switchFrom' | 'switchNetwork';

interface Action<T = string> {
  type: ActionType;
  payload: T;
}

const store: StoreState = {
  account: '',
  from: 'main',
  network: 'pangolin',
};

export function accountReducer(state: StoreState, action: Action<string>): StoreState {
  switch (action.type) {
    case 'setAccount': {
      return {
        ...state,
        account: action.payload,
        from: action.payload?.startsWith('0x') ? 'smart' : 'main',
      };
    }

    case 'switchFrom': {
      return { ...state, account: '', from: action.payload as AccountType };
    }

    case 'switchNetwork': {
      return { ...state, network: action.payload as NetworkType };
    }

    default:
      return state;
  }
}
type ActionHelper = <T = string>(type: ActionType) => (payload: T) => void;

export type AccountCtx =
  | (StoreState & {
      dispatch: Dispatch<Action>;
      createAction: ActionHelper;
      setAccount: (account: string) => void;
      switchFrom: (from: AccountType) => void;
      switchNetwork: (type: NetworkType) => void;
    })
  | null;

export const AccountContext = createContext<AccountCtx>(null);

export const AccountProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(accountReducer, store);
  const createAction: ActionHelper = (type) => (payload) =>
    dispatch({ type, payload: payload as never });
  const setAccount = useCallback(createAction('setAccount'), []);
  const switchFrom = useCallback(createAction<AccountType>('switchFrom'), []);
  const switchNetwork = useCallback(createAction<NetworkType>('switchNetwork'), []);

  return (
    <AccountContext.Provider
      value={{ ...state, dispatch, createAction, setAccount, switchFrom, switchNetwork }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext) as Exclude<AccountCtx, null>;
