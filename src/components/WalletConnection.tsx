import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi } from '../hooks';
import { AccountType } from '../model';
import { connectFactory } from '../utils';

const CONFIG: {
  [key in AccountType]: { type: string; logo: string; wallet: string; doc: string };
} = {
  substrate: {
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
  const { account } = useAccount();
  const { setAccounts, setNetworkStatus, accountType, network, accounts } = useApi();
  const connect = connectFactory(setAccounts, t, setNetworkStatus);

  return (
    <>
      <Button
        onClick={() => {
          if (!accounts && !account) {
            setIsHelpModalVisible(true);
          }
          connect(network, accountType);
        }}
      >
        {t('Link Wallet')}
      </Button>

      <Modal
        title={t('Connect to Darwinia {{type}} account', {
          type: CONFIG[accountType].type,
        })}
        visible={isHelperModalVisible}
        footer={null}
        onCancel={() => setIsHelpModalVisible(false)}
      >
        <div className='flex flex-col items-center'>
          <p>
            {t(
              'You are trying to transfer from Darwinia {{type}} account, you must first obtain authorization from the wallet.',
              { type: CONFIG[accountType].type }
            )}
          </p>

          <div className='flex justify-between items-center p-4 w-full rounded-xl mt-4 border border-gray-200'>
            <b>{CONFIG[accountType].wallet}</b>
            <img src={CONFIG[accountType].logo} style={{ height: 32 }} alt='' />
          </div>

          <Button
            className='mt-4 self-end'
            onClick={() => {
              window.open(CONFIG[accountType].doc, 'blank');
            }}
          >
            {t('How to use?')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
