import { Button, Modal } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../../hooks';
import { toOppositeAccountType } from '../../utils';
import { IModalProps } from './interface';

export function SwitchWalletModal({ isVisible, cancel, confirm }: IModalProps) {
  const { switchFrom, from } = useAccount();
  const { t } = useTranslation();
  const ok = useCallback(() => {
    switchFrom(toOppositeAccountType(from));
    if (confirm) {
      confirm();
    }
    cancel();
  }, [from, cancel, switchFrom, confirm]);

  return (
    <Modal
      title={t('Switch Wallet')}
      visible={isVisible}
      onOk={ok}
      onCancel={cancel}
      footer={[
        <button className='dream-btn w-1/2' onClick={cancel}>
          {t('Cancel')}
        </button>,
        <Button type='primary' onClick={ok} className='w-1/2 bg-main border-none rounded-xl'>
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
