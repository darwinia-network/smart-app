import { FrownOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { SubmittableResult } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Alert, AlertProps, Button, Form, Input, notification, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Bignumber from 'bignumber.js';
import React, { ReactNode, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { DVM_RING_WITHDRAW_ADDRESS, PRECISION, TOKEN_ERC20_KTON } from '../config';
import { validateMessages } from '../config/validate-msg';
import { useAccount, useApi, useAssets } from '../hooks';
import { Assets } from '../model';
import { TransferFormValues } from '../model/transfer';
import {
  convertToDvm,
  convertToSS58,
  dvmAddressToAccountId,
  registry,
  toBn,
  toOppositeAccountType,
} from '../utils';
import KtonABI from '../utils/api/abi/ktonABI.json';
import { connectFactory } from '../utils/api/api';
import { formatBalance } from '../utils/format/formatBalance';
import { isValidAddress, isValidPolkadotAddress } from '../utils/helper/validate';
import { Balance } from './Balance';
import { AccountModal } from './modal/Account';
import { TransferAlertModal } from './modal/TransferAlert';
import { TransferConfirmModal } from './modal/TransferConfirm';
import { ShortAccount } from './ShortAccount';
import { TransferControl } from './TransferControl';

interface Indicator {
  status: 'pending' | 'success' | 'fail' | 'sending' | null;
  message: string | ReactNode;
  type: AlertProps['type'];
}

const INDICATOR_STATUS_ICON: { [key in Exclude<Indicator['status'], null>]?: ReactNode } = {
  pending: <LoadingOutlined />,
  sending: <SyncOutlined spin />,
};

const DELAY_TIME = 5000;

function IndicatorMessage({ msg, index }: { msg: string; index: string }) {
  return (
    <p className='flex justify-between'>
      <span className='mr-4'>{msg}</span>
      <ShortAccount account={index} />
    </p>
  );
}

export function TransferForm() {
  const [form] = useForm<TransferFormValues>();
  const { t } = useTranslation();
  const { account } = useAccount();
  const { accounts, network, accountType, api, setNetworkStatus, setAccounts } = useApi();
  const { assets, reloadAssets } = useAssets();
  const [balance, setBalance] = useState<string>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [isIndicatorVisible, setIsIndictorVisible] = useState(false);
  const [equalToDvmAddress, setEqualToDvmAddress] = useState<string>(null);
  const [indicator, setIndicator] = useState<Indicator>({
    status: 'pending',
    message: t('Waiting for confirm'),
    type: 'info',
  });
  const connect = connectFactory(setAccounts, t, setNetworkStatus);
  // tslint:disable-next-line: no-magic-numbers
  const delayCloseIndicator = () => setTimeout(() => setIsIndictorVisible(false), DELAY_TIME);
  const handleSuccess = (index: string) => {
    setIndicator({
      type: 'success',
      message: <IndicatorMessage msg={t('Extrinsic success')} index={index} />,
      status: 'success',
    });
    reloadAssets();
    delayCloseIndicator();
    setIsAccountVisible(true);
  };
  const handleError = () => {
    notification.error({
      message: t('Extrinsic Error'),
      icon: <FrownOutlined color='red' />,
    });
    delayCloseIndicator();
  };

  const mainnetToSmart = async () => {
    setIndicator({ message: t('Waiting for sign'), type: 'info', status: 'pending' });
    setIsIndictorVisible(true);

    // tslint:disable-next-line: no-shadowed-variable
    const { recipient, amount, assets } = form.getFieldsValue();
    const toAccount = dvmAddressToAccountId(recipient).toHuman();
    const injector = await web3FromAddress(account);
    const count = toBn(amount);

    api.setSigner(injector.signer);

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
                    <IndicatorMessage msg={t('Extrinsic failed')} index={index.toRawType()} />
                  ),
                  status: 'fail',
                });
                delayCloseIndicator();
              } else if (method === 'ExtrinsicSuccess') {
                handleSuccess(index.toRawType());
              }
            });
        }

        if (result.isError) {
          handleError();
        }
      }
    );

    setIsConfirmVisible(false);
  };

  const smartToMainnet = async () => {
    const { recipient, amount, assets: selectedAsset } = form.getFieldsValue();
    const accountIdHex = registry.createType('AccountId', convertToSS58(recipient)).toHex();
    const web3 = new Web3(window.ethereum);

    if (accountIdHex === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return;
    }

    try {
      setIsIndictorVisible(true);
      setIndicator({ message: t('Sending'), type: 'info', status: 'sending' });
      let txHash;

      if (selectedAsset === 'ring') {
        txHash = await web3.eth
          .sendTransaction({
            from: account,
            to: DVM_RING_WITHDRAW_ADDRESS,
            data: accountIdHex,
            value: Web3.utils.toWei(amount),
            gas: 55000,
          })
          .on('error', (e) => {
            handleError();
          })
          .on('transactionHash', (_) => {
            setIsConfirmVisible(false);
          });
      }

      if (selectedAsset === 'kton') {
        const withdrawalAddress = convertToDvm(recipient);
        // tslint:disable-next-line: no-any
        const ktonContract = new web3.eth.Contract(KtonABI as any, TOKEN_ERC20_KTON);

        txHash = await ktonContract.methods
          .withdraw(withdrawalAddress, amount)
          .send({ from: account });
        setIsConfirmVisible(false);
      }

      handleSuccess(txHash.transactionHash);
    } catch (err) {
      handleError();
    }
  };

  useEffect(() => {
    form.setFields([
      { name: 'recipient', errors: [], touched: false, value: null },
      { name: 'amount', errors: [], touched: false, value: null },
    ]);
  }, [accountType, form]);

  useEffect(() => {
    const asset = form.getFieldValue('assets') as Assets;

    setBalance(formatBalance(assets[asset], accountType, asset));
  }, [assets, accountType, form]);

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
                if (!value) {
                  return Promise.resolve();
                }

                return isValidAddress(value, accountType, network)
                  ? Promise.resolve()
                  : Promise.reject();
              },
              message: t('You may have entered a wrong account'),
            },
          ]}
          extra={
            <p className='overflow-ellipsis overflow-hidden text-xs'>
              {!!equalToDvmAddress
                ? t(
                    'You may entered SS58 format address, the dvm address corresponding to this transaction is {{equalToDvmAddress}} ',
                    { equalToDvmAddress }
                  )
                : t(
                    'Please make sure to enter a correct darwinia {{type}} account, the asset loss caused by incorrect account input will not be recovered!',
                    { type: t(toOppositeAccountType(accountType)) }
                  )}
            </p>
          }
        >
          <Input
            onChange={(event) => {
              const isSS58Address = isValidPolkadotAddress(event.target.value);

              if (accountType === 'main' && network !== 'crab' && isSS58Address) {
                const address = convertToDvm(event.target.value);

                setEqualToDvmAddress(address);
              } else {
                setEqualToDvmAddress(null);
              }
            }}
          />
        </Form.Item>

        <Form.Item label={t('Assets')} name='assets' rules={[{ required: true }]}>
          <Select
            onChange={(value: Assets) => {
              setBalance(formatBalance(assets[value], accountType, value));
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
            { pattern: /^[\d,]+(.\d{1,3})?$/ },
            ({ getFieldValue }) => ({
              // tslint:disable-next-line: cyclomatic-complexity
              validator(_, value) {
                const asset = getFieldValue('assets') as Assets;
                const base = new Bignumber(
                  asset === 'kton' && accountType === 'smart'
                    ? value
                    : // tslint:disable-next-line: no-magic-numbers
                      value * Math.pow(10, accountType === 'main' ? PRECISION : 18)
                );
                const max = new Bignumber(assets[asset].toString());

                if (!value || (!!value && base.lt(max))) {
                  return Promise.resolve();
                } else {
                  return Promise.reject();
                }
              },
              message: t(
                'A valid amount must be greater than 0 and less than the maximum available amount'
              ),
            }),
          ]}
        >
          <Balance placeholder={t('Available balance {{balance}}', { balance })} />
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
              disabled={isIndicatorVisible}
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
        confirm={() => {
          if (accountType === 'main') {
            mainnetToSmart();
          }

          if (accountType === 'smart') {
            smartToMainnet();
          }
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
        className='fixed top-40 right-8 border-none'
        message={indicator.message}
        type={indicator.type}
        icon={INDICATOR_STATUS_ICON[indicator.status] || null}
        showIcon
        style={{ display: isIndicatorVisible ? 'flex' : 'none' }}
      />
    </>
  );
}
