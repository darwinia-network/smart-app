/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState } from 'react';

interface AccountCtx {
  account: string;
  setAccount: (account: string) => void;
}

export const AccountContext = createContext<AccountCtx>(null);

export const AccountProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [account, setAccount] = useState<string>(null);

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
