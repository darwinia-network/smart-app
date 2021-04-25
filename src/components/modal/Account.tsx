// tslint:disable:no-magic-numbers
import { LoadingOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Button, Card, Col, List, message, Modal, Row, Tabs, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import BN from 'bn.js';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from 'graphql-hooks';
import { useTranslation } from 'react-i18next';
import { NETWORK_SS58_PREFIX, NETWORK_TOKEN_NAME } from '../../config';
import { useAccount, useApi } from '../../hooks';
import { Assets } from '../../model';
import {
  convertToSS58,
  copyTextToClipboard,
  dvmAddressToAccountId,
  isSS58Address,
} from '../../utils';
import { formatBalance, precisionBalance } from '../../utils/format/formatBalance';
import { Account } from '../Account';
import { CloseIcon, CopyIcon, JazzIcon, ViewBrowserIcon } from '../icons';
import { ShortAccount } from '../ShortAccount';
import { IModalProps } from './interface';

const TRANSFERS_QUERY = `
  query transfers($account: String!, $offset: Int, $limit: Int) {
    transfers(
      offset: $offset,
      first: $limit,
      filter: {
        fromId: { equalTo: $account },
        # or: {
        #   toId: { equalTo: "2q5gtYfh3ULgFbrvXSVQFucLNiqKQF4TW9ifKjDx8AdNo5D2" }
        # }
      },
 			orderBy: TIMESTAMP_DESC
    ){
      totalCount
      nodes {
        toId
        fromId
        amount
        timestamp
        tokenId
        fee
        blockNumber
        blockId
      }
    }
  }
`;

const { TabPane } = Tabs;

const iconSize = 42;

interface IRecord {
  id: string;
  asset: string;
  action: string;
  amount: string;
  timestamp: string;
  account: string;
  accountType: string;
}

interface TransfersQueryRes {
  transfers: { totalCount: number; nodes: Transfer[] };
}

interface Transfer {
  amount: string;
  blockId: string;
  blockNumber: string;
  fee: string;
  fromId: string;
  timestamp: string;
  toId: string;
  tokenId: 'balances' | 'kton';
}

enum TokenType {
  balances = 'ring',
  kton = 'kton',
}

function patchRecords(source: Transfer[], currentAccount: string): IRecord[] {
  // tslint:disable-next-line: cyclomatic-complexity
  return (source || []).map((item) => {
    const { blockId, fromId, toId, amount, tokenId, timestamp } = item;
    const asset = TokenType[tokenId];
    const signerId = currentAccount === fromId ? fromId : toId;
    const isSS58 = isSS58Address(signerId);

    return {
      id: blockId,
      asset: asset || 'unknown',
      action: currentAccount === fromId ? 'send' : 'receive',
      amount: precisionBalance(amount),
      timestamp,
      accountType: isSS58 ? 'substrate' : 'smart',
      account: signerId,
    };
  });
}

export function AccountModal({
  isVisible,
  cancel,
  assets,
}: IModalProps & { assets: { ring: BN; kton: BN } }) {
  const { account, setAccount } = useAccount();
  const { setAccounts, accountType, network, isSubstrate } = useApi();
  const { t } = useTranslation();
  const { loading, data } = useQuery<TransfersQueryRes>(TRANSFERS_QUERY, {
    variables: {
      limit: 10,
      account: '2qeMxq616BhqvTW8a1bp2g7VKPAmpda1vXuAAz5TxV5ehivG', // !FIXME use account for process test.
      offset: 0,
    },
  });

  return (
    <Modal
      title={t('Address')}
      visible={isVisible}
      footer={null}
      onCancel={cancel}
      destroyOnClose={true}
      bodyStyle={{ maxHeight: '80vh', overflow: 'hidden' }}
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
                style={{ cursor: 'default' }}
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

      <Tabs type='card' className='account-tab'>
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
        <TabPane
          tab={t('Transfer History')}
          key='history'
          style={{ overflow: 'scroll', maxHeight: 300 }}
        >
          {loading ? (
            <LoadingOutlined spin className='mx-auto my-8 block' />
          ) : (
            <List
              itemLayout='horizontal'
              dataSource={patchRecords(data?.transfers.nodes, account)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    className='flex items-center'
                    title={
                      <b>
                        {t(item.action)}
                        <span className='uppercase ml-2'>
                          {NETWORK_TOKEN_NAME[network][item.asset as Assets]}
                        </span>
                      </b>
                    }
                    description={
                      <div className='text-xs'>
                        <p className='my-2'>
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>

                        <span className='inline-flex items-center gap-2'>
                          <span className='inline-flex items-center' style={{ width: 120 }}>
                            <span className='mr-1'>
                              {t(item.action === 'send' ? 'To' : 'From')}
                            </span>
                            <ShortAccount account={item.account} isCopyBtnDisplay={false} />
                          </span>
                          <Tag
                            color={item.accountType === 'substrate' ? '#5745de' : '#ec3783'}
                            className='rounded-xl text-xs cursor-default'
                          >
                            {t(item.accountType)}
                          </Tag>
                        </span>
                      </div>
                    }
                  />
                  <div className='flex flex-col items-stretch justify-end'>
                    <b className='uppercase'>
                      {item.amount} {NETWORK_TOKEN_NAME[network][item.asset as Assets]}
                    </b>
                    <ViewBrowserIcon
                      onClick={() => {
                        const url = `https://${network}.subscan.io/block/${item.id}?tab=event`;

                        window.open(url, 'blank');
                      }}
                      className='text-xl text-right cursor-pointer'
                    />
                  </div>
                </List.Item>
              )}
            />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
}
