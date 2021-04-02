import { message, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../hooks';
import { AccountType } from '../model';
import { connectEth, connectFactory, connectSubstrate } from '../utils';

const CONFIG: {
  [key in AccountType]: { type: string; logo: string; wallet: string; doc: string };
} = {
  main: {
    type: 'mainnet',
    logo: '/image/polkadot-logo.svg',
    wallet: 'polkadot.js',
    doc: 'https://polkadot.js.org',
  },
  smart: {
    type: 'smart',
    logo: '/image/metamask.jpeg',
    wallet: 'metamask',
    doc: 'https://metamask.io',
  },
};

export function WalletConnection() {
  const { t } = useTranslation();
  const [isHelperModalVisible, setIsHelpModalVisible] = useState(false);
  const { setAccounts, setNetworkStatus, from, network, accounts, account } = useAccount();
  const connect = connectFactory(setAccounts, t, setNetworkStatus);

  return (
    <>
      <button
        className='dream-btn'
        onClick={() => {
          if (!accounts && !account) {
            setIsHelpModalVisible(true);
          }
          connect(network, from);
        }}
      >
        {t('Link Wallet')}
      </button>

      <Modal
        title={t('Connect to Darwinia {{type}} account', {
          type: CONFIG[from].type,
        })}
        visible={isHelperModalVisible}
        footer={null}
        onCancel={() => setIsHelpModalVisible(false)}
      >
        <div className='flex flex-col items-center'>
          <p>
            {t(
              'You are trying to transfer from Darwinia {{type}} account, you must first obtain authorization from the wallet.',
              { type: CONFIG[from].type }
            )}
          </p>

          <div className='flex justify-between items-center p-4 w-full rounded-xl mt-4 border border-gray-200'>
            <b>{CONFIG[from].wallet}</b>
            <img src={CONFIG[from].logo} style={{ height: 32 }} alt='' />
          </div>

          <button
            className='dream-btn mt-4 self-end'
            onClick={() => {
              window.open(CONFIG[from].doc, 'blank');
            }}
          >
            {t('How to use?')}
          </button>
        </div>
      </Modal>
    </>
  );
}
