import { Button, Dropdown, Menu, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi, useAssets } from '../hooks';
import { toOppositeAccountType } from '../utils';
import { Account } from './Account';
import { AccountModal } from './modal/Account';
import { AccountSelectModal } from './modal/AccountSelect';
import { SwitchWalletModal } from './modal/SwitchWallet';
import { ShortAccount } from './ShortAccount';
import { WalletConnection } from './WalletConnection';

export function Connection() {
  const { t } = useTranslation();
  const [isWalletSwitcherVisible, setIsWalletSwitcherVisible] = useState(false);
  const [isAccountSwitcherVisible, setIsAccountSwitcherVisible] = useState(false);
  const [isAccountDetailVisible, setIsAccountDetailVisible] = useState(false);
  const { account, setAccount } = useAccount();
  const { accounts, setAccounts, accountType, isSubstrate } = useApi();
  const { assets } = useAssets();

  // tslint:disable-next-line: cyclomatic-complexity
  useEffect(() => {
    if (isSubstrate && !!accounts && !account) {
      setIsAccountSwitcherVisible(true);
    }

    if (accountType === 'smart' && !!accounts) {
      setAccount(accounts[0].address);
    }
  }, [accounts, account, accountType, setAccount, isSubstrate]);

  return (
    <>
      {!!accounts && !!account ? (
        <section className='flex items-center gap-2'>
          {account && (
            <Account
              onClick={() => {
                setIsAccountDetailVisible(true);
              }}
            >
              <ShortAccount
                account={account}
                className='self-stretch px-4 bg-white my-px mx-px rounded-xl'
              />
            </Account>
          )}

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  disabled={accountType === 'smart'}
                  onClick={() => setIsAccountSwitcherVisible(true)}
                >
                  <Tooltip
                    placement='left'
                    title={accountType === 'smart' ? t('Switch in metamask please!') : null}
                  >
                    {t('Use another {{type}} address', { type: accountType })}
                  </Tooltip>
                </Menu.Item>
                <Menu.Item onClick={() => setIsWalletSwitcherVisible(true)}>
                  {t('Switch to {{type}} address', { type: toOppositeAccountType(accountType) })}
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

      <AccountModal
        assets={assets}
        isVisible={isAccountDetailVisible}
        cancel={() => setIsAccountDetailVisible(false)}
      />
    </>
  );
}
