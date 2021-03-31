import BaseIdentityIcon from '@polkadot/react-identicon';
import { Button, Empty, Form, Modal, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../providers/account';

interface AccountSelectProps {
  account?: string;
  isVisible: boolean;
  confirm: (account: string) => void;
  cancel: () => void;
}

const iconSize = 36;

export function AccountSelect({ account, isVisible, confirm, cancel }: AccountSelectProps) {
  const { from, accounts } = useAccount();
  const { t } = useTranslation();
  const [form] = useForm();

  return (
    <Modal
      title={t('Select Account')}
      visible={isVisible}
      maskClosable={false}
      closable={!accounts?.length}
      onCancel={cancel}
      footer={
        accounts?.length
          ? [
              <Button
                key='primary-btn'
                type='primary'
                onClick={() => {
                  const value = form.getFieldValue('account');
                  if (!!value) {
                    confirm(value);
                    cancel();
                  } else {
                    // message.info(t(''));
                  }
                }}
                className='block mx-auto w-full bg-main border-none rounded-lg'
              >
                {t('Confirm')}
              </Button>,
            ]
          : null
      }
    >
      {accounts?.length ? (
        <Form form={form} initialValues={{ account }}>
          <Form.Item name='account' rules={[{ required: true }]}>
            <Radio.Group className='w-full'>
              {accounts.map((item, index) => (
                <Radio.Button value={item.address} key={item.address} className='radio-list'>
                  <BaseIdentityIcon
                    theme='substrate'
                    size={iconSize}
                    className='mr-2 rounded-full border border-solid border-gray-100'
                    value={item.address}
                  />
                  <div className='flex flex-col'>
                    <b>{item.meta.name}</b>
                    <span>{item.address}</span>
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
          description={t('You haven’t created an account yet, go ahead and create one.')}
          className='flex justify-center flex-col items-center'
        >
          <button
            onClick={() => {
              const url = from === 'main' ? 'https://polkadot.js.org' : 'https://metamask.io';

              window.open(url, 'blank');
            }}
            className='dream-btn'
          >
            {t('How to create?')}
          </button>
        </Empty>
      )}
    </Modal>
  );
}
