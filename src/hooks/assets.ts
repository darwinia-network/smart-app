import BN from 'bn.js';
import { useEffect, useState } from 'react';
import web3 from 'web3';
import { Assets } from '../model';
import { getTokenBalanceDarwinia, getTokenBalanceEth } from '../utils';
import { useAccount } from './account';
import { useApi } from './api';

export function useAssets(asset: Assets = 'ring') {
  const { account } = useAccount();
  const { accountType, api } = useApi();
  const [assets, setAssets] = useState<{ ring: BN; kton: BN }>({ ring: null, kton: null });
  const [refresh, setRefresh] = useState<number>(Math.random()); // FIXME: just for refresh balance;

  useEffect(() => {
    (async () => {
      if (account && accountType === 'main') {
        const [ringBalance, ktonBalance] = await getTokenBalanceDarwinia(api, account);
        const ring = web3.utils.toBN(ringBalance);
        const kton = web3.utils.toBN(ktonBalance);
        const newBalance = { ring, kton };

        setAssets(newBalance);
      } else if (account && accountType === 'smart') {
        const [ring, kton] = await getTokenBalanceEth(account);

        setAssets({
          ring: web3.utils.toBN(ring),
          kton: web3.utils.toBN(kton),
        });
      } else {
        setAssets({ ring: new BN(0), kton: new BN(0) });
      }
    })();
  }, [account, accountType, asset, api, refresh]);

  return { assets, setRefresh };
}
