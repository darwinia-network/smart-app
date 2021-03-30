import { Avatar, Button, Dropdown, Form, Menu, Modal, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../providers/account';
import { ShortAccount } from './ShortAccount';

const data = [
  {
    title: 'aaa',
    account: '5Fy36xPCirJno19b6YpHho1SYAgGPUxgMSEXzzDdAzn9FK5K',
  },
  {
    title: 'bbb',
    account: '5Fy36xPCirJno19b6YpHho1SYAgGPUxgMSEXzzDdAzn9FK5L',
  },
  {
    title: 'ccc',
    account: '0xe36xPCirJno19b6YpHho1SYAgGPUxgMSEXzzDdAzn9FK5M',
  },
  {
    title: 'ddd',
    account: '0x436xPCirJno19b6YpHho1SYAgGPUxgMSEXzzDdAzn9FK5N',
  },
];

export function Connection() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMainNetSwitcherVisible, setIsMainNetSwitcherVisible] = useState(false);
  const [isSmartSwitcherVisible, setIsSmartSwitcherVisible] = useState(false);
  const [form] = useForm();
  const { from, account, setAccount, switchFrom } = useAccount();

  return (
    <>
      {account ? (
        <section className='flex items-center gap-2'>
          <div className='flex items-center justify-between bg-main h-auto leading-normal gap-2 pl-4 rounded-xl'>
            <img
              src='/image/darwinia.7ff17f8e.svg'
              className='scale-150'
              style={{ height: 32 }}
              alt=''
            />
            <span className='text-purple-500 px-2 py-0.5 rounded-xl bg-white'>{t('Main')}</span>
            <ShortAccount
              account={account}
              className='self-stretch px-4 bg-white my-px mx-px rounded-xl'
            />
          </div>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setIsMainNetSwitcherVisible(true)}>
                  {t('switch_to_another_main_address')}
                </Menu.Item>
                <Menu.Item onClick={() => setIsSmartSwitcherVisible(true)}>
                  {t('switch_to_smart_address')}
                </Menu.Item>
                <Menu.Item onClick={() => setAccount('')}>{t('disconnect')}</Menu.Item>
              </Menu>
            }
          >
            <Button>{t('change_wallet')}</Button>
          </Dropdown>
        </section>
      ) : (
        <button
          className='dream-btn'
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          {t('link_wallet')}
        </button>
      )}

      <Modal
        title={t('Connect to Darwinia main net account')}
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className='flex flex-col items-center'>
          <p>
            {t(
              'You are trying to transfer from Darwinia Smart Account/Darwinia Mainnet Account, you must first obtain authorization from the wallet.'
            )}
          </p>

          <div className='flex justify-between items-center p-4 w-full rounded-xl mt-4 border border-gray-200'>
            <span>polkadot.js</span>
            <img src='/image/polkadot-logo.svg' style={{ height: 32 }} alt='' />
          </div>

          <button
            className='dream-btn mt-4 self-end'
            onClick={() => {
              setAccount('5Fy36xPCirJno19b6YpHho1SYAgGPUxgMSEXzzDdAzn9FK5L');
              setIsModalVisible(false);
            }}
          >
            {t('How to use?')}
          </button>
        </div>
      </Modal>

      <Modal
        title={t('Select Account')}
        visible={isMainNetSwitcherVisible}
        onOk={() => {
          setIsMainNetSwitcherVisible(false);
        }}
        onCancel={() => setIsMainNetSwitcherVisible(false)}
        footer={[
          <Button
            type='primary'
            onClick={() => {
              console.log(form.getFieldValue('account'));
              setIsMainNetSwitcherVisible(false);
            }}
            className='block mx-auto w-full bg-main border-none rounded-lg'
          >
            {t('Confirm')}
          </Button>,
        ]}
      >
        <Form form={form} initialValues={{ account }}>
          <Form.Item name='account'>
            <Radio.Group className='w-full'>
              {data.map((item, index) => (
                <Radio.Button value={item.account} key={item.account} className='radio-list'>
                  <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                  <div className='flex flex-col'>
                    <b>{item.title}</b>
                    <span>{item.account}</span>
                  </div>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t('Switch Wallet')}
        visible={isSmartSwitcherVisible}
        onOk={() => {
          setIsSmartSwitcherVisible(false);
          switchFrom(from === 'main' ? 'smart' : 'main');
        }}
        onCancel={() => {
          setIsSmartSwitcherVisible(false);
        }}
        footer={[
          <button className='dream-btn w-1/2'>{t('Cancel')}</button>,
          <Button
            type='primary'
            onClick={() => {}}
            className='w-1/2 bg-main border-none rounded-xl'
          >
            {t('Confirm')}
          </Button>,
        ]}
        wrapClassName='large-footer-btn'
      >
        <p>
          {t(
            'Do you want to login with darwinia smart account? Current account will be disconnect after switch to darwinia smart account.'
          )}
        </p>
      </Modal>
    </>
  );
}
