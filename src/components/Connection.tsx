import { SwapOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi, useAssets } from '../hooks';
import { toOppositeAccountType, toUpperCaseFirst } from '../utils';
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
  const { accounts, setAccounts, accountType, isSubstrate, network } = useApi();
  const { assets } = useAssets();

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (isSubstrate && !!accounts && !account) {
      setIsAccountSwitcherVisible(true);
    }

    if (accountType === 'smart' && !!accounts) {
      setAccount(accounts[0]?.address);
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
                className='self-stretch sm:px-1 bg-white sm:my-px sm:mx-px sm:rounded-xl'
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
                    title={accountType === 'smart' ? t('Please switch network in Metamask') : null}
                  >
                    {t('Use another {{type}} address', { type: toUpperCaseFirst(accountType) })}
                  </Tooltip>
                </Menu.Item>
                <Menu.Item onClick={() => setIsWalletSwitcherVisible(true)}>
                  {t('Switch to {{type}} address', {
                    type: toUpperCaseFirst(toOppositeAccountType(accountType)),
                  })}
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setAccount(null);
                    setAccounts(null);
                  }}
                >
                  {t('Disconnect')}
                </Menu.Item>
              </Menu>
            }
          >
            <SwapOutlined
              className={`p-1 cursor-pointer rounded-full bg-${network}`}
              style={{ color: '#fff' }}
            />
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
