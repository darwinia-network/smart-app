import { Button, Modal } from 'antd';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi } from '../../hooks';
import { toOppositeAccountType, toUpperCaseFirst } from '../../utils';
import { CloseIcon } from '../icons';
import { IModalProps } from './interface';

export function SwitchWalletModal({ isVisible, cancel, confirm }: IModalProps) {
  const { switchAccountType, accountType } = useApi();
  const { setAccount } = useAccount();
  const { t } = useTranslation();
  const ok = useCallback(() => {
    switchAccountType(toOppositeAccountType(accountType));
    setAccount(null);
    if (confirm) {
      confirm();
    }
    cancel();
  }, [accountType, cancel, switchAccountType, confirm, setAccount]);

  return (
    <Modal
      title={t('Switch Network')}
      visible={isVisible}
      onOk={ok}
      onCancel={cancel}
      closeIcon={<CloseIcon />}
      footer={[
        <Button className='w-1/2' key='cancel' onClick={cancel}>
          {t('Cancel')}
        </Button>,
        <Button type='primary' key='confirm' onClick={ok} className='w-1/2 rounded-xl'>
          {t('Confirm')}
        </Button>,
      ]}
      wrapClassName='large-footer-btn'
    >
      <p>
        {t(
          'You are trying to switch the network to {{type}} network. The current network will be disconnected after switched.',
          { type: toUpperCaseFirst(toOppositeAccountType(accountType)) }
        )}
      </p>
    </Modal>
  );
}
