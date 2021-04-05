import { Button, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi } from '../hooks';
import { Account } from './Account';
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
            <Account>
              <ShortAccount
                account={account}
                className='self-stretch px-4 bg-white my-px mx-px rounded-xl'
              />
            </Account>
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
            <Button>{t('Switch Wallet')}</Button>
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
