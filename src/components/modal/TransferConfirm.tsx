import { Button, Modal } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_STYLE_CONFIG } from '../../config/network';
import { useApi } from '../../hooks';
import { TransferFormValues } from '../../model/transfer';
import { clsName, toOppositeAccountType } from '../../utils';
import { RightCircleIcon } from '../icons/right-circle';
import { IModalProps } from './interface';

export function TransferConfirmModal({
  isVisible,
  cancel,
  confirm,
  value,
}: IModalProps & { value: TransferFormValues }) {
  const { t } = useTranslation();
  const { accountType, network } = useApi();
  const cls = useMemo(
    () => clsName('rounded-xl flex flex-col items-center', NETWORK_STYLE_CONFIG[network].bgClsName),
    [network]
  );

  return (
    <Modal
      title={t('Transfer Confirm')}
      visible={isVisible}
      onCancel={cancel}
      footer={[
        <Button className='w-1/2' key='cancel-btn' onClick={cancel}>
          {t('Cancel')}
        </Button>,
        <Button key='primary-btn' type='primary' onClick={confirm} className='w-1/2 rounded-xl'>
          {t('Confirm')}
        </Button>,
      ]}
      wrapClassName='large-footer-btn'
    >
      <div className='flex justify-between items-center mb-4 px-8'>
        <div className={cls} style={{ width: 120, height: 100 }}>
          {/* TODO img  */}
          <img src={NETWORK_STYLE_CONFIG[network].logo} style={{ height: 60 }} alt='' />
          <Button className='capitalize cursor-default'>{accountType}</Button>
        </div>

        <RightCircleIcon className='text-4xl' />

        <div className={cls} style={{ width: 120, height: 100 }}>
          <img src={NETWORK_STYLE_CONFIG[network].logo} style={{ height: 60 }} alt='' />
          <Button className='capitalize cursor-default'>
            {toOppositeAccountType(accountType)}
          </Button>
        </div>
      </div>

      <div className='my-4 px-8'>
        <h4 className='text-gray-400 mb-2'>{t('Recipient Address')}</h4>
        <p>{value.recipient}</p>
      </div>

      <div className='my-4 px-8'>
        <h4 className='text-gray-400 mb-2'>{t('Amount')}</h4>
        <p>
          {value.amount} <span className='uppercase'>{value.assets}</span>
          {value.assets === 'kton' && <span>{t('Need to receive')}</span>}
        </p>
      </div>
    </Modal>
  );
}
