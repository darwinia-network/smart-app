// tslint:disable:no-magic-numbers
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Button, Card, Col, List, message, Modal, Row, Tabs } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import BN from 'bn.js';
import { useTranslation } from 'react-i18next';
import { NETWORK_SS58_PREFIX, NETWORK_TOKEN_NAME } from '../../config';
import { useAccount, useApi } from '../../hooks';
import { Assets } from '../../model';
import { convertToSS58, copyTextToClipboard, dvmAddressToAccountId } from '../../utils';
import { formatBalance } from '../../utils/format/formatBalance';
import { Account } from '../Account';
import { CloseIcon, CopyIcon, JazzIcon, ViewBrowserIcon } from '../icons';
import { ShortAccount } from '../ShortAccount';
import { IModalProps } from './interface';

type TabKey = 'assets' | 'history';

const { TabPane } = Tabs;

const iconSize = 42;

const history = [
  {
    asset: 'ring',
    action: 'send',
    amount: 999.99,
    timestamp: 'Jan 6',
    account: '0x245B4775082C144C22a4874B0fBa8c70c510c5AE',
    accountType: 'smart',
  },
  {
    asset: 'kton',
    action: 'receive',
    amount: 99.99,
    timestamp: 'Jan 6',
    account: '0x245B4775082C144C22a4874B0fBa8c70c510c5AE',
    accountType: 'substrate',
  },
];

export function AccountModal({
  isVisible,
  cancel,
  assets,
  defaultActiveTabKey = 'assets',
}: IModalProps & { defaultActiveTabKey?: TabKey; assets: { ring: BN; kton: BN } }) {
  const { account, setAccount } = useAccount();
  const { setAccounts, accountType, network, isSubstrate } = useApi();
  const { t } = useTranslation();

  return (
    <Modal
      title={t('Address')}
      visible={isVisible}
      footer={null}
      onCancel={cancel}
      destroyOnClose={true}
      closeIcon={<CloseIcon />}
    >
      <Card className='mb-4'>
        <Row gutter={4} className='overflow-hidden'>
          <Col span={4}>
            {isSubstrate ? (
              <BaseIdentityIcon
                theme='substrate'
                size={iconSize}
                className='mr-2 rounded-full border border-solid border-gray-100'
                value={account}
              />
            ) : (
              <JazzIcon address={account} />
            )}
          </Col>
          <Col span={20}>
            <Row>
              <Col>
                <span className='mr-4 text-gray-600 text-base'>{account}</span>
                <Account
                  isLargeRounded={false}
                  logoStyle={{ width: '1.5em', float: 'left' }}
                  containerStyle={{ display: 'inline-block' }}
                  textClassName='text-xs h-4 leading-4  mr-0.5'
                />
              </Col>
            </Row>

            <Row className='my-2' gutter={8}>
              <Col
                className='flex items-center'
                onClick={() => {
                  copyTextToClipboard(account).then(() => {
                    message.success(t('Copied'));
                  });
                }}
                style={{ cursor: 'copy' }}
              >
                <CopyIcon className='mr-2' />
                <span className='text-xs text-gray-600'>{t('Copy address')}</span>
              </Col>

              <Col className='flex items-center cursor-pointer'>
                <ViewBrowserIcon className='mr-2 text-xl' />
                <span
                  onClick={() => {
                    const address = isSubstrate
                      ? convertToSS58(account, NETWORK_SS58_PREFIX[network])
                      : dvmAddressToAccountId(account).toHuman();

                    window.open(`https://${network}.subscan.io/account/${address}`, 'blank');
                  }}
                  className='text-xs text-gray-600'
                >
                  {t('View in Subscan')}
                </span>
              </Col>
            </Row>

            <Row>
              <Button
                size='small'
                className='rounded-xl text-xs'
                onClick={() => {
                  setAccount(null);
                  setAccounts(null);
                  cancel();
                }}
              >
                {t('Disconnect')}
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>

      <Tabs type='card' defaultActiveKey={defaultActiveTabKey} className='account-tab'>
        <TabPane tab={t('Assets')} key='assets'>
          <List
            itemLayout='horizontal'
            dataSource={[
              {
                image: '/image/ring.svg',
                asset: NETWORK_TOKEN_NAME[network].ring,
                amount: formatBalance(assets.ring, accountType),
              },
              {
                image: '/image/kton.svg',
                asset: NETWORK_TOKEN_NAME[network].kton,
                amount: formatBalance(assets.kton, accountType),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  className='flex items-center'
                  avatar={<Avatar src={item.image} size={30} className='inline-block' />}
                  title={<b className='uppercase'>{item.asset}</b>}
                />
                <div>{item.amount}</div>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={t('Transfer History')} key='history'>
          <List
            itemLayout='horizontal'
            dataSource={history}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  className='flex items-center'
                  title={
                    <b>
                      {t(item.action)}{' '}
                      <span className='uppercase'>
                        {NETWORK_TOKEN_NAME[network][item.asset as Assets]}
                      </span>
                    </b>
                  }
                  description={
                    <span className='inline-flex gap-2'>
                      <span>{item.timestamp}</span>
                      <span>{t(item.action === 'send' ? 'To' : 'From')}</span>
                      <ShortAccount account={item.account} isCopyBtnDisplay={false} />
                      <Button
                        type={item.accountType === 'substrate' ? 'primary' : 'default'}
                        size='small'
                        className='rounded-xl text-xs cursor-default'
                      >
                        {t(item.accountType)}
                      </Button>
                    </span>
                  }
                />
                <div className='flex flex-col items-stretch justify-end'>
                  <b className='uppercase'>
                    {item.amount} {NETWORK_TOKEN_NAME[network][item.asset as Assets]}
                  </b>
                  <ViewBrowserIcon className='text-xl text-right cursor-pointer' />
                </div>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
