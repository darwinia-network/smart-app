import BaseIdentityIcon from '@polkadot/react-identicon';
import { Button, Empty, Form, Modal, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';
import { CloseIcon } from '../icons';
import { IModalProps } from './interface';

const iconSize = 36;

export function AccountSelectModal({ account, isVisible, confirm, cancel }: IModalProps<string>) {
  const { accounts, isSubstrate } = useApi();
  const { t } = useTranslation();
  const [form] = useForm();

  return (
    <Modal
      title={t('Select the address to connect')}
      visible={isVisible}
      maskClosable={false}
      onCancel={cancel}
      bodyStyle={{
        maxHeight: '50vh',
        overflow: 'scroll',
      }}
      closeIcon={<CloseIcon />}
      footer={
        accounts?.length
          ? [
              <Button
                key='primary-btn'
                type='primary'
                size='large'
                onClick={() => {
                  const value = form.getFieldValue('account');
                  if (value) {
                    confirm(value);
                    cancel();
                  } else {
                    // message.info(t(''));
                  }
                }}
                className='block mx-auto w-full border-none rounded-lg'
              >
                {t('Confirm')}
              </Button>,
            ]
          : null
      }
    >
      {accounts?.length ? (
        <Form form={form} initialValues={{ account: account || accounts[0].address }}>
          <Form.Item name='account' rules={[{ required: true }]}>
            <Radio.Group className='w-full'>
              {accounts.map((item) => (
                <Radio.Button value={item.address} key={item.address} className='radio-list'>
                  <BaseIdentityIcon
                    theme='substrate'
                    size={iconSize}
                    className='mr-2 rounded-full border border-solid border-gray-100'
                    value={item.address}
                  />
                  <div className='flex flex-col leading-5'>
                    <b>{item.meta?.name}</b>
                    <span className='opacity-60'>{item.address}</span>
                  </div>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      ) : (
        <Empty
          image='/image/empty.png'
          imageStyle={{ height: 44 }}
          description={t('You haven’t created an address yet, please create a address first.')}
          className='flex justify-center flex-col items-center'
        >
          <Button
            onClick={() => {
              const url = isSubstrate ? 'https://polkadot.js.org' : 'https://metamask.io';

              window.open(url, 'blank');
            }}
          >
            {t('How to create?')}
          </Button>
        </Empty>
      )}
    </Modal>
  );
}
