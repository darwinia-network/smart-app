import { DownOutlined, SwapOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkType } from '../model';
import { useAccount } from '../providers/account';

export interface TransferValue {
  from?: string;
  to?: string;
}

export interface TransferSelectProps {
  value?: any;
  onChange?: () => void;
}

interface AccountProps {
  text: string;
  direction: string;
}

function AccountGrid({ text, direction }: AccountProps) {
  const [account, setAccount] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { switchNetwork } = useAccount();
  const { t } = useTranslation();
  const whirl = 'animate-whirl';
  const whirlReverse = 'animate-whirl-reverse';

  useEffect(() => {
    const textRef = panelRef.current?.querySelector('.bg-main');

    panelRef.current?.classList.remove(whirl);
    textRef?.classList.remove(whirlReverse);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        panelRef.current?.classList.add(whirl);
        textRef?.classList.add(whirlReverse);
      });
    });

    const listener = () => setAccount(text);

    panelRef.current?.addEventListener('animationend', listener);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => panelRef.current?.removeEventListener('animationend', listener);
  }, [text]);

  return (
    <div>
      <p className='mb-2'>{direction}</p>
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu
            onClick={({ key }) => {
              switchNetwork(key as NetworkType);
            }}
          >
            <Menu.Item key='darwinia'>{t('Darwinia')}</Menu.Item>
            <Menu.Item key='crab'>{t('Crab')}</Menu.Item>
            <Menu.Item key='pangolin'>{t('Pangolin')}</Menu.Item>
          </Menu>
        }
      >
        <div
          ref={panelRef}
          className={
            'border border-gray-200 border-solid flex items-center justify-between text-lg p-1 rounded-xl bg-gray-100 cursor-pointer'
          }
        >
          <div
            className='bg-main rounded-xl flex flex-col items-center'
            style={{ width: 120, height: 100 }}
          >
            <img src='/image/darwinia.7ff17f8e.svg' style={{ height: 60 }} alt='' />
            <span className='dream-btn'>{account}</span>
          </div>

          <DownOutlined className='mx-2' />
        </div>
      </Dropdown>
    </div>
  );
}

export function TransferSelect({ value, onChange }: TransferSelectProps) {
  const { t } = useTranslation();
  const { from, switchFrom } = useAccount();

  return (
    <div className='grid grid-cols-3 items-stretch'>
      <AccountGrid text={t(from)} direction={t('From')} />

      <div className='flex items-center justify-center self-stretch'>
        <SwapOutlined
          onClick={() => {
            switchFrom(from === 'main' ? 'smart' : 'main');
          }}
          className='cursor-pointer text-4xl mt-6 text-gray-400 hover:text-gray-800 transition-all duration-300'
        />
      </div>

      <AccountGrid text={t(from === 'main' ? 'smart' : 'main')} direction={t('To')} />
    </div>
  );
}
