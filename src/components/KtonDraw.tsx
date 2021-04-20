import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, message, notification } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { useAccount, useApi, useAssets } from '../hooks';
import { connectSubstrate, dvmAddressToAccountId, receiveKton } from '../utils';
import { precisionBalance } from '../utils/format/formatBalance';
import { ShortAccount } from './ShortAccount';

export function KtonDraw() {
  const { api, isSubstrate, network, setApi } = useApi();
  const { account } = useAccount();
  const { reloadAssets } = useAssets();
  const [isVisible, setIsVisible] = useState(false);
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
        // tslint:disable-next-line: no-any
        const ktonUsableBalance = await (apiPromise.rpc as any).balances.usableBalance(1, address);
        const usableBalance = ktonUsableBalance.usableBalance.toString();
        const count = Web3.utils.toBN(
          Web3.utils.toWei(precisionBalance(usableBalance, false), 'ether')
        );

        setBalance(count);
        setIsVisible(count.gt(new BN(0)));
      } catch (error) {
        message.error(error.message);
      }
    })();
  }, [api, account, isSubstrate, network, setApi]);

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
                t('You have {{amount}} KTON to claim', {
                  amount: Web3.utils.fromWei(balance.toString(), 'ether'),
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
