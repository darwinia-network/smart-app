import { Button, Modal } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';
import { toOppositeAccountType } from '../../utils';
import { IModalProps } from './interface';

export function SwitchWalletModal({ isVisible, cancel, confirm }: IModalProps) {
  const { switchAccountType, accountType } = useApi();
  const { t } = useTranslation();
  const ok = useCallback(() => {
    switchAccountType(toOppositeAccountType(accountType));
    if (confirm) {
      confirm();
    }
    cancel();
  }, [accountType, cancel, switchAccountType, confirm]);

  return (
    <Modal
      title={t('Switch Wallet')}
      visible={isVisible}
      onOk={ok}
      onCancel={cancel}
      footer={[
        <Button className='w-1/2' onClick={cancel}>
          {t('Cancel')}
        </Button>,
        <Button type='primary' onClick={ok} className='w-1/2 border-none rounded-xl'>
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
