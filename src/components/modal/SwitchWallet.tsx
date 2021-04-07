import { Button, Modal } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi } from '../../hooks';
import { toOppositeAccountType } from '../../utils';
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
      title={t('Switch Wallet')}
      visible={isVisible}
      onOk={ok}
      onCancel={cancel}
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
          'Do you want to login with darwinia smart account? Current account will be disconnect after switch to darwinia smart account.'
        )}
      </p>
    </Modal>
  );
}
