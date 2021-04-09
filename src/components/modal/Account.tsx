// tslint:disable:no-magic-numbers
import { CopyOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Button, Card, Col, List, message, Modal, Row, Tabs } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import BN from 'bn.js';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi } from '../../hooks';
import { copyTextToClipboard } from '../../utils';
import { formatBalance } from '../../utils/format/formatBalance';
import { Account } from '../Account';
import { JazzIcon } from '../icons';
import { ViewBrowserIcon } from '../icons/view-browser';
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
    accountType: 'main',
  },
];

export function AccountModal({
  isVisible,
  cancel,
  assets,
  defaultActiveTabKey = 'assets',
}: IModalProps & { defaultActiveTabKey?: TabKey; assets: { ring: BN; kton: BN } }) {
  const { account, setAccount } = useAccount();
  const { setAccounts, accountType } = useApi();
  const { t } = useTranslation();

  return (
    <Modal
      title={t('Account')}
      visible={isVisible}
      footer={null}
      onCancel={cancel}
      destroyOnClose={true}
    >
      <Card className='mb-4'>
        <Row gutter={4} className='overflow-hidden'>
          <Col span={4}>
            {accountType === 'main' ? (
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
                <span className='mr-4'>{account}</span>
                <Account
                  isLargeRounded={false}
                  logoStyle={{ height: '.63rem', transform: 'scale(3)' }}
                  className='inline-flex'
                  textClassName='text-xs transform scale-75'
                />
              </Col>
            </Row>

            <Row className='my-2' gutter={8}>
              <Col
                className='flex items-center'
                onClick={() => {
                  copyTextToClipboard(account).then(() => {
                    message.success(t('Success copied'));
                  });
                }}
                style={{ cursor: 'copy' }}
              >
                <CopyOutlined className='mr-2' />
                <span>{t('Copy address')}</span>
              </Col>

              <Col className='flex items-center cursor-pointer'>
                <ViewBrowserIcon className='mr-2 text-xl' />
                <span>{t('View in browser')}</span>
              </Col>
            </Row>

            <Row>
              <Button
                size='small'
                className='rounded-xl text-sm'
                onClick={() => {
                  setAccount(null);
                  setAccounts(null);
                }}
              >
                {t('disconnect')}
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
                asset: 'ring',
                amount: formatBalance(assets.ring, accountType),
              },
              {
                image: '/image/kton.svg',
                asset: 'kton',
                amount: formatBalance(assets.kton, accountType),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  className='flex items-center'
                  avatar={<Avatar src={item.image} />}
                  title={<b className='uppercase'>{item.asset}</b>}
                />
                <div>{item.amount}</div>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={t('History')} key='history'>
          <List
            itemLayout='horizontal'
            dataSource={history}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  className='flex items-center'
                  title={
                    <b>
                      {t(item.action)} <span className='uppercase'>{item.asset}</span>
                    </b>
                  }
                  description={
                    <span className='inline-flex gap-2'>
                      <span>{item.timestamp}</span>
                      <span>{t(item.action === 'send' ? 'To' : 'From')}</span>
                      <ShortAccount account={item.account} isCopyBtnDisplay={false} />
                      <Button
                        type={item.accountType === 'main' ? 'primary' : 'default'}
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
                    {item.amount} {item.asset}
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
