import { web3FromAddress } from '@polkadot/extension-dapp';
import { Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import BN from 'bn.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import web3 from 'web3';
import { validateMessages } from '../config/validate-msg';
import { useApi } from '../hooks';
import { useAccount } from '../hooks/account';
import { useAssets } from '../hooks/assets';
import { Assets } from '../model';
import { TransferFormValues } from '../model/transfer';
import { dvmAddressToAccountId, toOppositeAccountType } from '../utils';
import { connectFactory } from '../utils/api/connect';
import { formatBalance } from '../utils/format/formatBalance';
import { Balance } from './Balance';
import { AccountModal } from './modal/Account';
import { TransferAlertModal } from './modal/TransferAlert';
import { TransferConfirmModal } from './modal/TransferConfirm';
import { TransferControl } from './TransferControl';

export function TransferForm() {
  const [form] = useForm<TransferFormValues>();
  const { t } = useTranslation();
  const { account } = useAccount();
  const { accounts, network, accountType, api, setNetworkStatus, setAccounts } = useApi();
  const { assets, formattedBalance, setFormattedBalance } = useAssets('ring');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [hash, setHash] = useState<string>('');
  const connect = connectFactory(setAccounts, t, setNetworkStatus);

  return (
    <>
      <Form
        name='transfer'
        layout='vertical'
        form={form}
        initialValues={{
          recipient: '',
          assets: 'ring',
          amount: '',
        }}
        onFinish={(_) => {
          setIsAlertVisible(true);
        }}
        validateMessages={validateMessages}
      >
        <Form.Item>
          <TransferControl />
        </Form.Item>

        <Form.Item
          label={t('Recipient Address')}
          name='recipient'
          rules={[
            { required: true },
            {
              validator(_, value) {
                if (accountType === 'main') {
                  const valid = web3.utils.isAddress(value);

                  return valid ? Promise.resolve() : Promise.reject();
                } else {
                  return Promise.resolve();
                }
              },
              message: t('You may have entered a wrong account'),
            },
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
              const available = formatBalance(assets[value]);

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
              className='block mx-auto w-1/3 rounded-xl text-white'
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
              className='block mx-auto w-1/3 rounded-xl text-white'
            >
              {t('Confirm to transfer')}
            </Button>
          )}
        </Form.Item>
      </Form>

      <TransferAlertModal
        isVisible={isAlertVisible}
        cancel={() => setIsAlertVisible(false)}
        recipient={form.getFieldValue('recipient')}
        confirm={() => {
          setIsAlertVisible(false);
          setIsConfirmVisible(true);
        }}
      />

      <TransferConfirmModal
        isVisible={isConfirmVisible}
        cancel={() => setIsConfirmVisible(false)}
        value={form.getFieldsValue()}
        confirm={async () => {
          // tslint:disable-next-line: no-shadowed-variable
          const { recipient, amount, assets } = form.getFieldsValue();
          const toAccount = dvmAddressToAccountId(recipient).toHuman();
          const injector = await web3FromAddress(account);

          api.setSigner(injector.signer);

          // tslint:disable-next-line: no-shadowed-variable
          const hash =
            assets === 'ring'
              ? api.tx.balances.transfer(toAccount, web3.utils.toBN(amount))
              : api.tx.kton.transfer(toAccount, web3.utils.toBN(amount));

          setHash(hash.toHex()); // TODO: add history
          setIsAccountVisible(true);
          setIsConfirmVisible(false);
        }}
      />

      <AccountModal
        isVisible={isAccountVisible}
        defaultActiveTabKey='history'
        cancel={() => setIsAccountVisible(false)}
        confirm={() => {}}
      />
    </>
  );
}
