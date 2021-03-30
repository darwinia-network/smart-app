/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, Dispatch, useCallback, useContext, useReducer } from 'react';

export type FromType = 'main' | 'smart';

export interface StoreState {
  account: string | null;
  from: FromType;
}

export type ActionType = 'setAccount' | 'switchFrom';

export interface Action<T = string> {
  type: ActionType;
  payload: T;
}

const store: StoreState = {
  account: null,
  from: 'main',
};

export function accountReducer(state: StoreState, action: Action<string | null>): StoreState {
  switch (action.type) {
    case 'setAccount': {
      return {
        ...state,
        account: action.payload,
        from: action.payload?.startsWith('0x') ? 'smart' : 'main',
      };
    }

    case 'switchFrom': {
      return { ...state, account: null, from: action.payload as FromType };
    }

    default:
      return state;
  }
}
type ActionHelper<T = string> = (type: ActionType) => (payload: T) => void;

export type AccountCtx =
  | (StoreState & {
      dispatch: Dispatch<Action>;
      createAction: ActionHelper;
      setAccount: (account: string | null) => void;
      switchFrom: (from: FromType) => void;
    })
  | null;

export const AccountContext = createContext<AccountCtx>(null);

export const AccountProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(accountReducer, store);
  const createAction: ActionHelper<string | FromType | null> = (type) => (payload) =>
    dispatch({ type, payload });
  const setAccount = useCallback(createAction('setAccount'), []);
  const switchFrom = useCallback(createAction('switchFrom'), []);

  return (
    <AccountContext.Provider value={{ ...state, dispatch, createAction, setAccount, switchFrom }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext) as Exclude<AccountCtx, null>;
