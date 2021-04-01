import { Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import web3 from 'web3';
import { useAccount } from '../hooks/account';
import { getTokenBalanceDarwinia } from '../utils/api/connect';
import { formatBalance } from '../utils/format/formatBalance';
import { TransferSelect } from './TransferControl';

type Assets = 'ring' | 'kton';

interface TransferFormValues {
  receiveAddress: string;
  assets: Assets;
  amount: string;
}

export function TransferForm() {
  const [form] = useForm<TransferFormValues>();
  const { t } = useTranslation();
  const { account, network } = useAccount();
  const [balance, setBalance] = useState<{ ring: BN; kton: BN }>({ ring: null, kton: null });

  useEffect(() => {
    if (account) {
      getTokenBalanceDarwinia(account).then(([ringBalance, ktonBalance]) => {
        const ring = web3.utils.toBN(ringBalance);
        const kton = web3.utils.toBN(ktonBalance);

        console.log('%c [ ring ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', ring);
        setBalance({ ring, kton });
      });
    }
  }, [account, network]);

  return (
    <Form
      name='transfer'
      layout='vertical'
      form={form}
      initialValues={{
        receiveAddress: '',
        assets: 'ring',
        amount: '',
      }}
    >
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
        <Select
          onChange={() => {
            form.setFieldsValue({ amount: '' });
          }}
        >
          <Select.Option value='ring'>ring</Select.Option>
          <Select.Option value='kton'>kton</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t('Amount')}
        name='amount'
        rules={[{ required: true, message: t('Please input amount') }]}
      >
        <Input
          placeholder={t('Available balance {{balance}}', {
            balance: formatBalance(balance[form.getFieldValue('assets') as Assets]),
          })}
        />
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
