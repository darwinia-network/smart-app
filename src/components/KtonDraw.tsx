import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, notification } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import BN from 'bn.js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { useAccount, useApi, useAssets } from '../hooks';
import { connectSubstrate, depositKton, dvmAddressToAccountId } from '../utils';
import { precisionBalance } from '../utils/format/formatBalance';
import { ShortAccount } from './ShortAccount';

// eslint-disable-next-line complexity
export function KtonDraw() {
  const { api, isSubstrate, network, networkConfig, setApi } = useApi();
  const { account } = useAccount();
  const { reloadAssets } = useAssets();
  const [isVisible, setIsVisible] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [hash, setHash] = useState(null);
  const { t } = useTranslation();
  const [balance, setBalance] = useState<BN>(new BN(0));
  const claimKton = useCallback(
    async (isManually = false) => {
      setIsDisable(true);

      try {
        const txhash = await depositKton(account, balance, {
          erc20Address: networkConfig.erc20.kton,
          withdrawAddress: networkConfig.dvmWithdrawAddress.kton,
          isManually,
        });

        setHash(txhash);
        reloadAssets();
      } catch (err) {
        notification.error({
          message: (
            <div>
              <ErrorBoundary>
                <h3>{t('Claim Failed')}</h3>
                {err?.receipt && (
                  <p className='overflow-scroll' style={{ maxHeight: 200 }}>
                    {JSON.stringify(err?.receipt)}
                  </p>
                )}
              </ErrorBoundary>
            </div>
          ),
        });
      }

      setIsDisable(false);
    },
    [
      account,
      balance,
      networkConfig.dvmWithdrawAddress.kton,
      networkConfig.erc20.kton,
      reloadAssets,
      t,
    ]
  );

  useEffect(() => {
    (async () => {
      if (isSubstrate) {
        setIsVisible(false);
        setHash(null);

        return;
      }

      const address = dvmAddressToAccountId(account).toHuman();
      let apiPromise = api;

      if (!apiPromise) {
        const { api: newApi } = await connectSubstrate(network);

        apiPromise = newApi;
        setApi(newApi);
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ktonUsableBalance = await (apiPromise.rpc as any).balances.usableBalance(1, address);
        const usableBalance = ktonUsableBalance.usableBalance.toString();
        const count = Web3.utils.toBN(
          Web3.utils.toWei(precisionBalance(usableBalance, false), 'ether')
        );

        setBalance(count);
        setIsVisible(count.gt(new BN(0)));
      } catch (error) {
        setIsDisable(false);
        console.warn(error.message);
      }
    })();
  }, [api, account, isSubstrate, network, setApi]);

  return isVisible ? (
    <Alert
      type='success'
      className='fixed top-20 right-8 border-solid border-green-400 border'
      message={
        <div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              {isDisable ? (
                <LoadingOutlined className='text-lg mr-4 w-6' style={{ color: '#b7eb8f' }} spin />
              ) : (
                <img src='/image/kton.svg' className='mr-4 w-6' alt='' />
              )}

              <span>
                {hash ? (
                  <ShortAccount account={hash} />
                ) : (
                  t('You have {{amount}} {{ktonName}} to claim', {
                    amount: Web3.utils.fromWei(balance.toString(), 'ether'),
                    ktonName: networkConfig.token.kton,
                  })
                )}
              </span>
            </div>

            {hash ? (
              <Button
                onClick={() => {
                  setIsVisible(false);
                  setHash(null);
                  setIsDisable(false);
                }}
                className='ml-8'
                type='primary'
              >
                {t('Close')}
              </Button>
            ) : (
              <Button
                onClick={() => claimKton(false)}
                disabled={isDisable}
                type='primary'
                className='ml-8'
                style={{ backgroundColor: '#52C41A' }}
              >
                {t('Receive')}
              </Button>
            )}
          </div>
        </div>
      }
    />
  ) : null;
}
