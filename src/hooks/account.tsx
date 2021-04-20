/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { NETWORK_SS58_PREFIX } from '../config';
import { convertToSS58 } from '../utils';
import { useApi } from './api';

interface AccountCtx {
  account: string;
  setAccount: (account: string) => void;
}

export const AccountContext = createContext<AccountCtx>(null);

export const AccountProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [account, setAccount] = useState<string>(null);
  const { network } = useApi();

  useEffect(() => {
    if (!account) {
      return;
    }

    const ss58Account = convertToSS58(account, NETWORK_SS58_PREFIX[network]);

    setAccount(ss58Account);
  }, [network]);

  return (
    <AccountContext.Provider
      value={{
        setAccount,
        account,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext) as Exclude<AccountCtx, null>;
