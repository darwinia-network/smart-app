import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, notification } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi, useAssets } from '../hooks';
import { receiveKtonOnMainnet, receiveKtonOnSmart } from '../utils/api/kton';
import { ShortAccount } from './ShortAccount';

export function KtonDraw() {
  const { accountType } = useApi();
  const { account } = useAccount();
  const { reloadAssets } = useAssets();
  const [isVisible, setIsVisible] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [hash, setHash] = useState(null);
  const { t } = useTranslation();
  const amount = 10; // TODO: query kton amount;
  const receive = async (
    receiveFn: (account: string, amount: number, from?: string) => Promise<string>
  ) => {
    setIsDisable(true);

    try {
      const txhash = await receiveFn(account, amount);

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
  };

  useEffect(() => {
    // tslint:disable-next-line: no-any
    window.ethereum.on('message', (msg: any) => {
      reloadAssets();
    });
  }, [reloadAssets]);

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
                t('You have {{amount}} KTON to receive', { amount: 'some' })
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
                if (accountType === 'main') {
                  receive(receiveKtonOnMainnet);
                }

                if (accountType === 'smart') {
                  receive(receiveKtonOnSmart);
                }
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
