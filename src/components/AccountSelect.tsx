import { Avatar, Button, Form, Modal, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from '../hooks/connect';

interface AccountSelectProps {
  account?: string;
  isVisible: boolean;
  confirm: (account: string) => void;
  cancel: () => void;
}

export function AccountSelect({ account, isVisible, confirm, cancel }: AccountSelectProps) {
  //   const [isMainNetSwitcherVisible, setIsMainNetSwitcherVisible] = useState(true);
  const { accounts } = useConnect();
  const { t } = useTranslation();
  const [form] = useForm();

  return (
    <Modal
      title={t('Select Account')}
      visible={isVisible}
      onCancel={cancel}
      footer={[
        <Button
          type='primary'
          onClick={() => {
            confirm(form.getFieldValue('account'));
            cancel();
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
            {accounts.map((item, index) => (
              <Radio.Button value={item.address} key={item.address} className='radio-list'>
                <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                <div className='flex flex-col'>
                  <b>{item.meta.name}</b>
                  <span>{item.address}</span>
                </div>
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
