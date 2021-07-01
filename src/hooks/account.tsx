/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from 'react';
import { AccountContext, AccountCtx } from '../service/account-provider';

export const useAccount = () => useContext(AccountContext) as Exclude<AccountCtx, null>;
