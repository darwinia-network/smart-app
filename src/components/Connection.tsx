import { Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi } from '../hooks';
import { AccountSelectModal } from './modal/AccountSelect';
import { SwitchWalletModal } from './modal/SwitchWallet';
import { ShortAccount } from './ShortAccount';
import { WalletConnection } from './WalletConnection';

export function Connection() {
  const { t } = useTranslation();
  const [isWalletSwitcherVisible, setIsWalletSwitcherVisible] = useState(false);
  const [isAccountSwitcherVisible, setIsAccountSwitcherVisible] = useState(false);
  const { account, setAccount } = useAccount();
  const { accounts, setAccounts } = useApi();

  useEffect(() => {
    if (!!accounts && !account) {
      setIsAccountSwitcherVisible(true);
    }
  }, [accounts, account]);

  return (
    <>
      {!!accounts ? (
        <section className='flex items-center gap-2'>
          {account && (
            <div className='flex items-center justify-between bg-main h-auto leading-normal gap-2 pl-4 rounded-xl'>
              <img
                src='/image/darwinia.7ff17f8e.svg'
                className='scale-150'
                style={{ height: 32 }}
                alt=''
              />
              <span className='text-purple-500 px-2 py-0.5 rounded-xl bg-white'>{t('main')}</span>
              <ShortAccount
                account={account}
                className='self-stretch px-4 bg-white my-px mx-px rounded-xl'
              />
            </div>
          )}

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setIsAccountSwitcherVisible(true)}>
                  {t('Use another mainnet address')}
                </Menu.Item>
                <Menu.Item onClick={() => setIsWalletSwitcherVisible(true)}>
                  {t('Switch to smart address')}
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setAccount(null);
                    setAccounts(null);
                  }}
                >
                  {t('disconnect')}
                </Menu.Item>
              </Menu>
            }
          >
            <button className='dream-btn'>{t('Switch Wallet')}</button>
          </Dropdown>
        </section>
      ) : (
        <WalletConnection />
      )}

      <AccountSelectModal
        account={account}
        isVisible={isAccountSwitcherVisible}
        confirm={setAccount}
        cancel={() => setIsAccountSwitcherVisible(false)}
      />

      <SwitchWalletModal
        cancel={() => setIsWalletSwitcherVisible(false)}
        isVisible={isWalletSwitcherVisible}
      />
    </>
  );
}
