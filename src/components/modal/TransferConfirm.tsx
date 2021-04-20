import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Modal, Tag } from 'antd';
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
  const { accountType, network, isSubstrate } = useApi();
  const cls = useMemo(
    () => clsName('rounded-xl flex flex-col items-center', NETWORK_STYLE_CONFIG[network].bgClsName),
    [network]
  );
  const icon = useMemo(() => {
    if (network === 'darwinia') {
      return <RightCircleIcon className='text-4xl' />;
    } else {
      return (
        <ArrowRightOutlined
          className='text-2xl rounded-full leading-none p-1'
          style={{ color: 'white', backgroundColor: network === 'crab' ? '#ec3783' : '#5745de' }}
        />
      );
    }
  }, [network]);

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
          <img src={NETWORK_STYLE_CONFIG[network].logo} style={{ height: 60 }} alt='' />
          <Button className='capitalize cursor-default'>{accountType}</Button>
        </div>

        {icon}

        <div className={cls} style={{ width: 120, height: 100 }}>
          <img src={NETWORK_STYLE_CONFIG[network].logo} style={{ height: 60 }} alt='' />
          <Button className='capitalize cursor-default'>
            {toOppositeAccountType(accountType)}
          </Button>
        </div>
      </div>

      <div className='my-4 px-8'>
        <h4 className='text-gray-400 mb-2'>{t('Destination address')}</h4>
        <p>{value.recipient}</p>
      </div>

      <div className='my-4 px-8'>
        <h4 className='text-gray-400 mb-2'>{t('Amount')}</h4>
        <p>
          {value.amount} <span className='uppercase'>{value.assets}</span>
          {value.assets === 'kton' && isSubstrate && (
            <Tag color='blue' className='ml-4'>
              {t('Please claim in smart address')}
            </Tag>
          )}
        </p>
      </div>
    </Modal>
  );
}
