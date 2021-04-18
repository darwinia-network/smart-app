import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, notification } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { useAccount, useApi, useAssets } from '../hooks';
import { dvmAddressToAccountId, receiveKton } from '../utils';
import { precisionBalance } from '../utils/format/formatBalance';
import { ShortAccount } from './ShortAccount';

export function KtonDraw() {
  const { accountType, api } = useApi();
  const { account } = useAccount();
  const { reloadAssets } = useAssets();
  const [isVisible, setIsVisible] = useState(accountType === 'smart');
  const [isDisable, setIsDisable] = useState(false);
  const [hash, setHash] = useState(null);
  const { t } = useTranslation();
  const [balance, setBalance] = useState<BN>(new BN(0));

  useEffect(() => {
    // tslint:disable-next-line: no-any
    window.ethereum.on('message', (msg: any) => {
      reloadAssets();
    });
  }, [reloadAssets]);

  useEffect(() => {
    (async () => {
      if (accountType === 'main') {
        setIsVisible(false);

        return;
      }
      const address = dvmAddressToAccountId(account).toHuman();
      // tslint:disable-next-line: no-any
      const ktonUsableBalance = await (api.rpc as any).balances.usableBalance(1, address);
      const count = Web3.utils.toBN(ktonUsableBalance.usableBalance.toString());

      setBalance(count);
      setIsVisible(count.gt(new BN(0)));
    })();
  }, [accountType, api, account]);

  return isVisible ? (
    <Alert
      type='success'
      className='fixed top-20 right-8 border-solid border-green-400 border'
      message={
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
                t('You have {{amount}} KTON to receive', {
                  amount: precisionBalance(balance.toString()),
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
              onClick={async () => {
                setIsDisable(true);

                try {
                  const txhash = await receiveKton(account, balance);

                  setHash(txhash);
                } catch (err) {
                  notification.error({
                    message: (
                      <div>
                        <ErrorBoundary>
                          <h3>{t('Failed to claim')}</h3>
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
              }}
              disabled={isDisable}
              type='primary'
              className='ml-8'
              style={{ backgroundColor: '#52C41A' }}
            >
              {t('Receive')}
            </Button>
          )}
        </div>
      }
    />
  ) : null;
}