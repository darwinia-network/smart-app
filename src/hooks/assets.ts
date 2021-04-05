import BN from 'bn.js';
import { useEffect, useState } from 'react';
import web3 from 'web3';
import { Assets } from '../model';
import { getTokenBalanceDarwinia } from '../utils';
import { formatBalance } from '../utils/format/formatBalance';
import { useAccount } from './account';
import { useApi } from './api';

export function useAssets(asset: Assets = 'ring') {
  const { account } = useAccount();
  const { accountType, api } = useApi();
  const [formattedBalance, setFormattedBalance] = useState<string>('');
  const [assets, setAssets] = useState<{ ring: BN; kton: BN }>({ ring: null, kton: null });

  useEffect(() => {
    if (account && accountType === 'main') {
      getTokenBalanceDarwinia(api, account).then(([ringBalance, ktonBalance]) => {
        const ring = web3.utils.toBN(ringBalance);
        const kton = web3.utils.toBN(ktonBalance);
        const newBalance = { ring, kton };
        const available = formatBalance(newBalance[asset]);

        setAssets(newBalance);
        setFormattedBalance(available);
      });
    } else if (account && accountType === 'smart') {
      setAssets({ ring: new BN(0), kton: new BN(0) });
    } else {
      setAssets({ ring: new BN(0), kton: new BN(0) });
    }
  }, [account, accountType, asset, api]);

  return { assets, formattedBalance, setFormattedBalance };
}
