import { FrownOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { SubmittableResult } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Alert, AlertProps, Button, Form, Input, notification, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Bignumber from 'bignumber.js';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { ETHER_PRECISION, PRECISION } from '../config';
import { validateMessages } from '../config/validate-msg';
import { useAccount, useApi, useAssets } from '../hooks';
import { Assets } from '../model';
import { TransferFormValues } from '../model/transfer';
import {
  convertToDvm,
  convertToEth,
  convertToSS58,
  dvmAddressToAccountId,
  getInfoFromHash,
  patchUrl,
  registry,
  toBn,
  toOppositeAccountType,
  toUpperCaseFirst,
} from '../utils';
import KtonABI from '../utils/api/abi/ktonABI.json';
import { connectFactory } from '../utils/api/api';
import { formatBalance } from '../utils/format/formatBalance';
import { isSameAddress, isSS58Address, isValidAddress } from '../utils/helper/validate';
import { Balance } from './Balance';
import { DownIcon } from './icons';
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
    <div className='flex justify-between'>
      <span className='mr-4'>{msg}</span>
      <ShortAccount account={index} className='dark:text-white' />
    </div>
  );
}

// eslint-disable-next-line complexity
export function TransferForm() {
  const [form] = useForm<TransferFormValues>();
  const { t, i18n } = useTranslation();
  const { account } = useAccount();
  const {
    accounts,
    network,
    accountType,
    api,
    setNetworkStatus,
    setAccounts,
    isSubstrate,
    isSmart,
    networkConfig,
  } = useApi();
  const { assets, reloadAssets } = useAssets();
  const [balance, setBalance] = useState<string>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [isIndicatorVisible, setIsIndictorVisible] = useState(false);
  const [equalToDvmAddress, setEqualToDvmAddress] = useState<string>(null);
  const [indicator, setIndicator] = useState<Indicator>({
    status: 'pending',
    message: t('Pending'),
    type: 'info',
  });
  const handleRecipientChange = (value: string) => {
    if (isSubstrate && isSS58Address(value)) {
      const address = convertToEth(value);

      setEqualToDvmAddress(address);
    } else {
      setEqualToDvmAddress(null);
    }
  };
  const connect = connectFactory(setAccounts, t, setNetworkStatus);
  // eslint-disable-next-line no-magic-numbers
  const delayCloseIndicator = () => setTimeout(() => setIsIndictorVisible(false), DELAY_TIME);
  const handleSuccess = (index: string) => {
    setIndicator({
      type: 'success',
      message: <IndicatorMessage msg={t('Extrinsic Submitted')} index={index} />,
      status: 'success',
    });
    reloadAssets();
    delayCloseIndicator();
    setIsAccountVisible(true);
  };
  const handleError = () => {
    notification.error({
      message: t('Extrinsic Failed'),
      icon: <FrownOutlined color='red' />,
    });
    setIsIndictorVisible(false);
  };

  const mainnetToSmart = async () => {
    setIndicator({ message: t('Waiting for sign'), type: 'info', status: 'pending' });
    setIsIndictorVisible(true);

    // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
    const { recipient, amount, assets } = form.getFieldsValue();
    const toAccount = dvmAddressToAccountId(equalToDvmAddress || recipient).toHuman();
    // eslint-disable-next-line no-magic-numbers
    const injector = await web3FromAddress(convertToSS58(account, 42));
    const count = toBn(amount);

    api.setSigner(injector.signer);

    try {
      const extrinsic =
        assets === 'ring'
          ? api.tx.balances.transfer(toAccount, count)
          : api.tx.kton.transfer(toAccount, count);

      const unsubscribe = await extrinsic.signAndSend(
        account,
        // eslint-disable-next-line complexity
        async (result: SubmittableResult) => {
          if (!result || !result.status) {
            return;
          }

          setIndicator({ message: t('Pending'), type: 'info', status: 'sending' });

          if (result.status.isFinalized || result.status.isInBlock) {
            unsubscribe();

            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(
                ({
                  event: {
                    method,
                    data: { hash },
                  },
                }) => {
                  if (method === 'ExtrinsicFailed') {
                    setIndicator({
                      type: 'warning',
                      message: (
                        <IndicatorMessage msg={t('Extrinsic Failed')} index={hash.toHex()} />
                      ),
                      status: 'fail',
                    });
                    delayCloseIndicator();
                  } else if (method === 'ExtrinsicSuccess') {
                    handleSuccess(hash.toHex());
                  }
                }
              );
          }

          if (result.isError) {
            handleError();
          }
        }
      );
    } catch (err) {
      handleError();
    }

    setIsConfirmVisible(false);
  };

  const smartToMainnet = async () => {
    const { recipient, amount, assets: selectedAsset } = form.getFieldsValue();
    const accountIdHex = registry
      .createType('AccountId', convertToSS58(recipient, networkConfig.ss58Prefix))
      .toHex();
    const web3 = new Web3(window.ethereum);

    if (accountIdHex === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return;
    }

    try {
      setIsIndictorVisible(true);
      setIndicator({ message: t('Pending'), type: 'info', status: 'sending' });

      if (selectedAsset === 'ring') {
        const txHash = await web3.eth
          .sendTransaction({
            from: account,
            to: networkConfig.dvmWithdrawAddress.ring,
            data: accountIdHex,
            value: Web3.utils.toWei(amount),
            gas: 55000,
          })
          .on('transactionHash', (_) => {
            setIsConfirmVisible(false);
          });

        handleSuccess(txHash.transactionHash);
      }

      if (selectedAsset === 'kton') {
        const withdrawalAddress = convertToDvm(recipient);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ktonContract = new web3.eth.Contract(KtonABI as any, networkConfig.erc20.kton);
        const count = web3.utils.toWei(amount, 'ether');

        setIsConfirmVisible(false);

        const txHash = await ktonContract.methods
          .withdraw(withdrawalAddress, count)
          .send({ from: account });

        handleSuccess(txHash.transactionHash);
      }
    } catch (err) {
      handleError();
    }
  };

  useEffect(() => {
    form.setFields([
      { name: 'recipient', errors: [], touched: false, value: null },
      { name: 'amount', errors: [], touched: false, value: null },
    ]);
    setEqualToDvmAddress(null);
  }, [accountType, form]);

  useEffect(() => {
    const asset = form.getFieldValue('assets') as Assets;

    setBalance(formatBalance(assets[asset], accountType));
  }, [assets, accountType, form]);

  useEffect(() => {
    const { toAccount } = getInfoFromHash();

    if (toAccount) {
      form.setFieldsValue({ recipient: toAccount });
      handleRecipientChange(toAccount);
      patchUrl({ toAccount: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        validateMessages={validateMessages[i18n.language as 'en' | 'zh-CN' | 'zh']}
      >
        <Form.Item>
          <TransferControl />
        </Form.Item>

        <Form.Item
          label={t('Destination address')}
          name='recipient'
          validateFirst={true}
          rules={[
            { required: true },
            {
              validator(_, value) {
                return !isSameAddress(account, value) ? Promise.resolve() : Promise.reject();
              },
              message: t('Payment address and destination address cannot be the same'),
            },
            {
              validator(_, value) {
                const valid = isValidAddress(value, accountType);

                if (valid) {
                  patchUrl({ toAccount: value });

                  return Promise.resolve();
                } else {
                  patchUrl({ toAccount: '' });

                  return Promise.reject();
                }
              },
              message: t(
                isSubstrate
                  ? 'Input error Please input a smart address in 0x format or SS58 format'
                  : 'The address is wrong, please fill in a substrate address of the {{network}} network.',
                { network }
              ),
            },
          ]}
          extra={
            <p className='overflow-ellipsis overflow-hidden text-xs mt-1'>
              {equalToDvmAddress
                ? t(
                    'The smart address you entered is in SS58 format, and its corresponding 0x format is {{equalToDvmAddress}} ',
                    { equalToDvmAddress }
                  )
                : t(
                    'Please make sure you have entered the correct {{type}} address. Entering wrong address will cause asset loss and cannot be recovered!',
                    { type: toUpperCaseFirst(toOppositeAccountType(accountType)) }
                  )}
            </p>
          }
        >
          <Input onChange={(event) => handleRecipientChange(event.target.value)} size='large' />
        </Form.Item>

        <Form.Item label={t('Assets')} name='assets' rules={[{ required: true }]}>
          <Select
            onChange={(value: Assets) => {
              setBalance(formatBalance(assets[value], accountType));
              form.setFieldsValue({ amount: '' });
            }}
            size='large'
            suffixIcon={<DownIcon />}
          >
            <Select.Option value='ring'>{networkConfig.token.ring}</Select.Option>
            <Select.Option value='kton'>{networkConfig.token.kton}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('Amount')}
          name='amount'
          rules={[
            { required: true },
            { pattern: /^[\d,]+(.\d{1,3})?$/ },
            ({ getFieldValue }) => ({
              // eslint-disable-next-line complexity
              validator(_, value) {
                const asset = getFieldValue('assets') as Assets;
                const base = new Bignumber(
                  asset === 'kton' && accountType === 'smart'
                    ? value
                    : value * Math.pow(10, isSubstrate ? PRECISION : ETHER_PRECISION)
                );
                const max = new Bignumber(assets[asset].toString());

                if (!value || (!!value && base.lt(max))) {
                  return Promise.resolve();
                } else {
                  return Promise.reject();
                }
              },
              message: t(
                'The value entered must be greater than 0 and less than or equal to the maximum available value'
              ),
            }),
          ]}
        >
          <Balance placeholder={t('Available balance: {{balance}}', { balance })} size='large' />
        </Form.Item>

        <Form.Item style={{ margin: '48px 0 0 0' }}>
          {!accounts || !account ? (
            <Button
              type='primary'
              className='block mx-auto w-full rounded-xl text-white'
              size='large'
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
              size='large'
              disabled={isIndicatorVisible}
              className='block mx-auto w-full rounded-xl text-white'
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
          if (isSubstrate) {
            mainnetToSmart();
          }

          if (isSmart) {
            smartToMainnet();
          }
        }}
      />

      <AccountModal
        isVisible={isAccountVisible}
        assets={assets}
        cancel={() => setIsAccountVisible(false)}
        confirm={() => {
          // do nothing
        }}
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
