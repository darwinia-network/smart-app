import { Button, Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TransferSelect } from './TransferControl';

export function TransferForm() {
  const { t } = useTranslation();

  return (
    <Form name='transfer' layout='vertical'>
      <Form.Item>
        <TransferSelect />
      </Form.Item>

      <Form.Item
        label={t('Receiving Address')}
        name='receiveAddress'
        rules={[{ required: true, message: t('Please input receiving address!') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t('Assets')} name='assets' rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Amount')}
        name='amount'
        rules={[{ required: true, message: t('Please input amount') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className='block mx-auto w-1/3 bg-main rounded-xl text-white border-none'
        >
          {t('Connect Wallet')}
        </Button>
      </Form.Item>
    </Form>
  );
}
