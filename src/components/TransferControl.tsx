import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Network } from '../config';
import { NETWORK_STYLE_CONFIG } from '../config/network';
import { useAccount, useApi } from '../hooks';
import { AccountType, NetworkConfig, NetworkType } from '../model';
import { toOppositeAccountType } from '../utils';
import { SwapCrabIcon, SwapMainIcon, SwapPangolinIcon } from './icons';
import { SwitchWalletModal } from './modal/SwitchWallet';

export interface TransferValue {
  from?: string;
  to?: string;
}

interface AccountProps {
  accountType: AccountType;
  title: string;
  isFrom?: boolean;
}

const networks: NetworkType[] = [Network.darwinia, Network.crab, Network.pangolin];

export function AccountGrid({ accountType, title, isFrom = false }: AccountProps) {
  const [account, setAccount] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { switchNetwork, network } = useApi();
  const { t } = useTranslation();
  const whirl = 'animate-whirl';
  const whirlReverse = 'animate-whirl-reverse';

  useEffect(() => {
    const textRef = panelRef.current?.querySelector(`.${NETWORK_STYLE_CONFIG[network].bgClsName}`);

    panelRef.current?.classList.remove(whirl);
    textRef?.classList.remove(whirlReverse);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        panelRef.current?.classList.add(whirl);
        textRef?.classList.add(whirlReverse);
      });
    });

    const listener = () => setAccount(accountType);

    panelRef.current?.addEventListener('animationend', listener);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => panelRef.current?.removeEventListener('animationend', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType]);

  return (
    <div>
      <p className='mb-2'>{title}</p>
      <Dropdown
        trigger={['click']}
        className={isFrom ? 'cursor-pointer' : 'cursor-default'}
        overlay={
          isFrom ? (
            <Menu
              onClick={({ key }) => {
                switchNetwork(key as NetworkType);
              }}
            >
              {networks.map((item) => (
                <Menu.Item
                  key={item}
                  className={(item === network ? 'bg-gray-100' : '') + ' flex justify-between'}
                >
                  <span className='capitalize'>{t(item)}</span>
                  {accountType === 'smart' && (
                    <span
                      className={
                        'rounded-xl text-xs text-white px-2 py-0.5 ' +
                        NETWORK_STYLE_CONFIG[network].bgClsName
                      }
                    >
                      {t('smart')}
                    </span>
                  )}
                </Menu.Item>
              ))}
            </Menu>
          ) : (
            <span></span>
          )
        }
      >
        <div
          ref={panelRef}
          className={
            'border border-gray-200 border-solid flex items-center justify-between text-lg p-1 rounded-xl bg-gray-100'
          }
        >
          <div
            className={
              'rounded-xl flex flex-col items-center ' + NETWORK_STYLE_CONFIG[network].bgClsName
            }
            style={{ width: 120, height: 100 }}
          >
            <img src={NETWORK_STYLE_CONFIG[network].logo} style={{ height: 60 }} alt='' />
            <span
              className='capitalize dream-btn text-base'
              style={network === 'darwinia' ? {} : { border: 'none' }}
            >
              {t(account)}
            </span>
          </div>

          {isFrom && <DownOutlined className='mx-2' />}
        </div>
      </Dropdown>
    </div>
  );
}

// tslint:disable-next-line: no-any
const ICON_CONFIG: NetworkConfig<{ icon: (...args: any[]) => JSX.Element }> = {
  crab: { icon: SwapCrabIcon },
  pangolin: { icon: SwapPangolinIcon },
  darwinia: { icon: SwapMainIcon },
};

export function TransferControl() {
  const { t } = useTranslation();
  const { accountType, switchAccountType, network, isSubstrate } = useApi();
  const { setAccount, account } = useAccount();
  const [isWalletSwitcherVisible, setIsWalletSwitcherVisible] = useState(false);

  return (
    <>
      <div className='grid grid-cols-3 items-stretch'>
        <AccountGrid accountType={accountType} isFrom={true} title={t('From')} />

        <div className='flex items-center justify-center self-stretch'>
          {React.createElement(ICON_CONFIG[network].icon, {
            onClick: () => {
              if (!!account) {
                setIsWalletSwitcherVisible(true);
              } else {
                switchAccountType(toOppositeAccountType(accountType));
              }
            },
            className:
              'cursor-pointer text-4xl mt-6 transform origin-center transition-all duration-300',
            style: { transform: `rotateY(${isSubstrate ? '0' : '180deg'})` },
          })}
        </div>

        <AccountGrid accountType={toOppositeAccountType(accountType)} title={t('To')} />
      </div>

      <SwitchWalletModal
        cancel={() => setIsWalletSwitcherVisible(false)}
        confirm={() => {
          switchAccountType(toOppositeAccountType(accountType));
          setAccount(null);
        }}
        isVisible={isWalletSwitcherVisible}
      />
    </>
  );
}
