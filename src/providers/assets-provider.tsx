import BN from 'bn.js';
import { createContext, useCallback, useEffect, useState } from 'react';
import web3 from 'web3';
import { useAccount, useApi } from '../hooks';
import { getTokenBalanceDarwinia, getTokenBalanceEth, isNetworkConsistent } from '../utils';

export interface AssetsState {
  ring: BN;
  kton: BN;
}

export interface AssetsCtx {
  assets: AssetsState;
  reloadAssets: () => void;
}

export const AssetsContext = createContext<AssetsCtx>(null);

export const AssetsProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { account } = useAccount();
  const { api, isSubstrate, isSmart, network, networkConfig } = useApi();
  const [assets, setAssets] = useState<{ ring: BN; kton: BN }>({ ring: null, kton: null });
  const reloadAssets = useCallback(
    // eslint-disable-next-line complexity
    async (chainId?: string) => {
      let [ring, kton] = ['0', '0'];

      if (account && isSubstrate) {
        [ring, kton] = await getTokenBalanceDarwinia(api, account);
      }

      if (account && isSmart) {
        const isConsistent = await isNetworkConsistent(network, chainId);

        // we have show notification in api provider.
        if (isConsistent) {
          [ring, kton] = await getTokenBalanceEth(networkConfig.erc20.kton, account);
        }
      }

      setAssets({
        ring: web3.utils.toBN(ring),
        kton: web3.utils.toBN(kton),
      });
    },
    [account, api, isSubstrate, isSmart, network, networkConfig]
  );

  useEffect(() => {
    reloadAssets().then(() => {
      // do nothing;
    });

    if (window.ethereum) {
      window.ethereum.on('chainChanged', reloadAssets);
    }

    return () => {
      window.ethereum.removeListener('chainChanged', reloadAssets);
    };
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
