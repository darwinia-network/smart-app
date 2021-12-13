import { LoadingOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Button, Card, Col, Empty, List, message, Modal, Row, Tabs, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import BN from 'bn.js';
import { formatDistanceToNow } from 'date-fns';
import { useManualQuery } from 'graphql-hooks';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useApi, useCancelablePromise } from '../../hooks';
import { Assets } from '../../model';
import {
  asUTCString,
  convertToSS58,
  copyTextToClipboard,
  dvmAddressToAccountId,
  isSS58Address,
} from '../../utils';
import { formatBalance, precisionBalance } from '../../utils/format/formatBalance';
import { Account } from '../Account';
import { EllipsisMiddle } from '../EllipsisMiddle';
import { CloseIcon, CopyIcon, JazzIcon, ViewBrowserIcon } from '../icons';
import { ShortAccount } from '../ShortAccount';
import { IModalProps } from './interface';

const TRANSFERS_QUERY = `
  query transfers($account: String!, $offset: Int, $limit: Int) {
    transfers(
      offset: $offset,
      last: $limit,
      filter: {
        or: [ 
          { fromId: { equalTo: $account } },
          { toId: { equalTo: $account } }
        ]
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
      timestamp: asUTCString(timestamp),
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
  const { setAccounts, accountType, network, isSubstrate, networkConfig } = useApi();
  const { t } = useTranslation();
  const makeCancelable = useCancelablePromise();
  const [fetchTransfers, { loading, data }] = useManualQuery<TransfersQueryRes>(TRANSFERS_QUERY, {
    variables: {
      limit: 10,
      account: isSubstrate
        ? convertToSS58(account, networkConfig.ss58Prefix)
        : convertToSS58(dvmAddressToAccountId(account).toHuman(), networkConfig.ss58Prefix),
      offset: 0,
    },
    skipCache: true,
  });

  useEffect(() => {
    if (isVisible) {
      makeCancelable(fetchTransfers());
    }
  }, [fetchTransfers, isVisible, makeCancelable]);

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
                    const acc = isSubstrate ? account : dvmAddressToAccountId(account).toHuman();
                    const address = convertToSS58(acc, networkConfig.ss58Prefix);

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
        <TabPane
          tab={t('Assets')}
          key='assets'
          className='p-4 border border-t-0 rounded-b-xl dark:border-dark'
        >
          <List
            itemLayout='horizontal'
            dataSource={[
              {
                image: '/image/ring.svg',
                asset: { name: networkConfig.token.ring, contract: networkConfig.erc20.ring },
                amount: formatBalance(assets.ring, accountType),
              },
              {
                image: '/image/kton.svg',
                asset: { name: networkConfig.token.kton, contract: networkConfig.erc20.kton },
                amount: formatBalance(assets.kton, accountType),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  className='flex items-center'
                  avatar={<Avatar src={item.image} size={30} className='inline-block' />}
                  title={<b className='uppercase'>{item.asset.name}</b>}
                  description={<EllipsisMiddle>{item.asset.contract}</EllipsisMiddle>}
                />
                <div>{item.amount}</div>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane
          tab={t('Transfer History')}
          key='history'
          style={{ overflow: 'scroll', maxHeight: '35vh' }}
          className='scroll-bar-hidden p-4 border border-t-0 rounded-b-xl dark:border-dark'
        >
          {loading ? (
            <LoadingOutlined spin className='mx-auto my-8 block' />
          ) : data?.transfers.nodes.length ? (
            <List
              itemLayout='horizontal'
              dataSource={[
                ...patchRecords(data?.transfers.nodes, account),
                {
                  id: 'more',
                  asset: '',
                  action: '',
                  timestamp: '',
                  account: '',
                  accountType: '',
                  amount: '',
                },
              ]}
              renderItem={(item) =>
                item.id !== 'more' ? (
                  <List.Item>
                    <List.Item.Meta
                      className='flex items-center'
                      title={
                        <b>
                          {t(item.action)}
                          <span className='uppercase ml-2'>
                            {networkConfig.token[item.asset as Assets]}
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
                        {item.amount} {networkConfig.token[item.asset as Assets]}
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
                ) : (
                  <List.Item className='justify-center'>
                    <Button
                      size='small'
                      type='link'
                      onClick={() => {
                        const url = `https://${network}.subscan.io/account/${account}?tab=transfer`;

                        window.open(url, 'blank');
                      }}
                    >
                      {t('View More')}
                    </Button>
                  </List.Item>
                )
              }
            />
          ) : (
            <Empty
              image='/image/empty.png'
              imageStyle={{ height: 44 }}
              description={t('No data')}
              className='flex justify-center flex-col items-center opacity-60 my-8'
            />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
}
