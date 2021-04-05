import { FrownOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { SubmittableResult } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Alert, AlertProps, Button, Form, Input, notification, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import BN from 'bn.js';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import web3 from 'web3';
import { validateMessages } from '../config/validate-msg';
import { useApi } from '../hooks';
import { useAccount } from '../hooks/account';
import { useAssets } from '../hooks/assets';
import { Assets } from '../model';
import { TransferFormValues } from '../model/transfer';
import { dvmAddressToAccountId, toBn, toOppositeAccountType } from '../utils';
import { connectFactory } from '../utils/api/connect';
import { formatBalance } from '../utils/format/formatBalance';
import { Balance } from './Balance';
import { AccountModal } from './modal/Account';
import { TransferAlertModal } from './modal/TransferAlert';
import { TransferConfirmModal } from './modal/TransferConfirm';
import { TransferControl } from './TransferControl';

interface Indicator {
  status: 'pending' | 'success' | 'fail' | 'sending' | null;
  message: string | ReactNode;
  type: AlertProps['type'];
}

const INDICATOR_STATUS_ICON: { [key in Indicator['status']]?: ReactNode } = {
  pending: <LoadingOutlined />,
  sending: <SyncOutlined spin />,
};

function IndicatorMessage({ msg, index }: { msg: string; index: string }) {
  return (
    <p className='flex justify-between'>
      <span>{msg}</span>
      <span>{index}</span>
    </p>
  );
}

export function TransferForm() {
  const [form] = useForm<TransferFormValues>();
  const { t } = useTranslation();
  const { account } = useAccount();
  const { accounts, network, accountType, api, setNetworkStatus, setAccounts } = useApi();
  const { assets, formattedBalance, setFormattedBalance, setRefresh } = useAssets('ring');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [isIndicatorVisible, setIsIndictorVisible] = useState(false);
  const [indicator, setIndicator] = useState<Indicator>({
    status: 'pending',
    message: t('Waiting for confirm'),
    type: 'info',
  });
  const connect = connectFactory(setAccounts, t, setNetworkStatus);
  // tslint:disable-next-line: no-magic-numbers
  const delayCloseIndicator = () => setTimeout(() => setIsIndictorVisible(false), 5000);

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
          setIndicator({ message: t('Waiting for sign'), type: 'info', status: 'pending' });
          setIsIndictorVisible(true);

          // tslint:disable-next-line: no-shadowed-variable
          const { recipient, amount, assets } = form.getFieldsValue();
          const toAccount = dvmAddressToAccountId(recipient).toHuman();
          const injector = await web3FromAddress(account);
          const count = toBn(amount);

          api.setSigner(injector.signer);

          console.log(new BN(amount), count);

          // tslint:disable-next-line: no-shadowed-variable
          const extrinsic =
            assets === 'ring'
              ? api.tx.balances.transfer(toAccount, count)
              : api.tx.kton.transfer(toAccount, count);

          const unsubscribe = await extrinsic.signAndSend(
            account,
            // tslint:disable-next-line: cyclomatic-complexity
            async (result: SubmittableResult) => {
              if (!result || !result.status) {
                return;
              }

              setIndicator({ message: t('Sending'), type: 'info', status: 'sending' });

              if (result.status.isFinalized || result.status.isInBlock) {
                unsubscribe();

                result.events
                  .filter(({ event: { section } }) => section === 'system')
                  .forEach(({ event: { method, index } }) => {
                    if (method === 'ExtrinsicFailed') {
                      setIndicator({
                        type: 'warning',
                        message: (
                          <IndicatorMessage
                            msg={t('Extrinsic failed!')}
                            index={index.toRawType()}
                          />
                        ),
                        status: 'fail',
                      });
                      delayCloseIndicator();
                    } else if (method === 'ExtrinsicSuccess') {
                      setIndicator({
                        type: 'success',
                        message: (
                          <IndicatorMessage
                            msg={t('Extrinsic success')}
                            index={index.toRawType()}
                          />
                        ),
                        status: 'success',
                      });
                      setRefresh(Math.random());
                      delayCloseIndicator();
                      setIsAccountVisible(true);
                    }
                  });
              }

              if (result.isError) {
                notification.error({
                  message: t('Extrinsic Error'),
                  icon: <FrownOutlined color='red' />,
                });
                setIsIndictorVisible(false);
              }
            }
          );

          setIsConfirmVisible(false);
        }}
      />

      <AccountModal
        isVisible={isAccountVisible}
        defaultActiveTabKey='history'
        assets={assets}
        cancel={() => setIsAccountVisible(false)}
        confirm={() => {}}
      />

      <Alert
        className='fixed top-24 right-8'
        message={indicator.message}
        type={indicator.type}
        icon={INDICATOR_STATUS_ICON[indicator.status] || null}
        showIcon
        style={{ display: isIndicatorVisible ? 'flex' : 'none' }}
      />
    </>
  );
}
