import { Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import web3 from 'web3';
import { validateMessages } from '../config/validate-msg';
import { useApi } from '../hooks';
import { useAccount } from '../hooks/account';
import { Assets } from '../model';
import { TransferFormValues } from '../model/transfer';
import { toOppositeAccountType } from '../utils';
import { connectFactory, getTokenBalanceDarwinia } from '../utils/api/connect';
import { formatBalance } from '../utils/format/formatBalance';
import { Balance } from './Balance';
import { TransferConfirmModal } from './modal/TransferConfirm';
import { TransferSelect } from './TransferControl';

export function TransferForm() {
  const [form] = useForm<TransferFormValues>();
  const { t } = useTranslation();
  const { account } = useAccount();
  const { accounts, network, accountType, api, setNetworkStatus, setAccounts } = useApi();
  const [balance, setBalance] = useState<{ ring: BN; kton: BN }>({ ring: null, kton: null });
  const [formattedBalance, setFormattedBalance] = useState<string>('');
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const connect = connectFactory(setAccounts, t, setNetworkStatus);

  useEffect(() => {
    if (account && accountType === 'main') {
      getTokenBalanceDarwinia(api, account).then(([ringBalance, ktonBalance]) => {
        const ring = web3.utils.toBN(ringBalance);
        const kton = web3.utils.toBN(ktonBalance);
        const newBalance = { ring, kton };
        const available = formatBalance(newBalance[form.getFieldValue('assets') as Assets]);

        setBalance(newBalance);
        setFormattedBalance(available);
      });
    } else if (account && accountType === 'smart') {
      setBalance({ ring: new BN(0), kton: new BN(0) });
    } else {
      setBalance({ ring: new BN(0), kton: new BN(0) });
    }
  }, [account, accountType, form, api]);

  return (
    <>
      <Form
        name='transfer'
        layout='vertical'
        form={form}
        initialValues={{
          receiveAddress: '',
          assets: 'ring',
          amount: '',
        }}
        onFinish={(_) => {
          setIsConfirmVisible(true);
        }}
        validateMessages={validateMessages}
      >
        <Form.Item>
          <TransferSelect />
        </Form.Item>

        <Form.Item
          label={t('Receiving Address')}
          name='receiveAddress'
          rules={[
            { required: true },
            accountType === 'main'
              ? { pattern: /^0x[\w\d]+/, message: t('You may have entered a wrong account') }
              : {},
          ]}
          extra={
            <span className='text-xs'>
              {t(
                'Please make sure to enter a correct darwinia {{type}} account, the asset loss caused by incorrect account input will not be recovered!',
                { type: t(toOppositeAccountType(accountType)) }
              )}
            </span>
          }
        >
          <Input />
        </Form.Item>

        <Form.Item label={t('Assets')} name='assets' rules={[{ required: true }]}>
          <Select
            onChange={(value: Assets) => {
              const available = formatBalance(balance[value]);

              setFormattedBalance(available);
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
          rules={[
            { required: true },
            { pattern: /^[\d,]+$/ },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  (!!value && new BN(value).lt(new BN(formattedBalance.split('.')[0])))
                ) {
                  return Promise.resolve();
                } else {
                  return Promise.reject();
                }
              },
              message: t('Greater than max available amount!'),
            }),
          ]}
        >
          <Balance
            placeholder={t('Available balance {{balance}}', {
              balance: formattedBalance,
            })}
          />
        </Form.Item>

        <Form.Item>
          {!accounts || !account ? (
            <Button
              type='primary'
              className='block mx-auto w-1/3 rounded-xl text-white border-none'
              onClick={() => {
                connect(network, accountType);
              }}
            >
              {t('Connect Wallet')}
            </Button>
          ) : (
            <Button
              type='primary'
              htmlType='submit'
              className='block mx-auto w-1/3 rounded-xl text-white border-none'
            >
              {t('Confirm to transfer')}
            </Button>
          )}
        </Form.Item>
      </Form>

      <TransferConfirmModal
        isVisible={isConfirmVisible}
        cancel={() => setIsConfirmVisible(false)}
        value={form.getFieldsValue()}
        confirm={() => {
          const value = form.getFieldsValue();

          console.log('%c [ value ]-165', 'font-size:13px; background:pink; color:#bf2c9f;', value);
        }}
      />
    </>
  );
}
