import BN from 'bn.js';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import web3 from 'web3';
import { getTokenBalanceDarwinia, getTokenBalanceEth, isNetworkConsistent } from '../utils';
import { useAccount } from './account';
import { useApi } from './api';

interface AssetsState {
  ring: BN;
  kton: BN;
}

interface AssetsCtx {
  assets: AssetsState;
  reloadAssets: () => void;
}

export const AssetsContext = createContext<AssetsCtx>(null);

export const AssetsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { account } = useAccount();
  const { api, isSubstrate, isSmart, network } = useApi();
  const [assets, setAssets] = useState<{ ring: BN; kton: BN }>({ ring: null, kton: null });
  // tslint:disable-next-line: cyclomatic-complexity
  const reloadAssets = useCallback(async () => {
    let [ring, kton] = ['0', '0'];

    if (account && isSubstrate) {
      [ring, kton] = await getTokenBalanceDarwinia(api, account);
    }

    if (account && isSmart) {
      const isConsistent = await isNetworkConsistent(network);

      // we have show notification in api provider.
      if (isConsistent) {
        [ring, kton] = await getTokenBalanceEth(account);
      }
    }

    setAssets({
      ring: web3.utils.toBN(ring),
      kton: web3.utils.toBN(kton),
    });
  }, [account, api, isSubstrate, isSmart, network]);

  useEffect(() => {
    reloadAssets().then(() => {});
  }, [reloadAssets]);

  return (
    <AssetsContext.Provider
      value={{
        reloadAssets,
        assets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => useContext(AssetsContext) as Exclude<AssetsCtx, null>;
