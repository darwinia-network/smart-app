import { CopyOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

export interface ShortAccountProps {
  account: string;
  isCopyBtnDisplay?: boolean;
  className?: string;
}

export function ShortAccount({
  account,
  className = '',
  isCopyBtnDisplay = true,
}: ShortAccountProps) {
  const endPosition = 6;
  const shortAccount = (
    <span className='cursor-default'>
      {`${account.slice(0, endPosition)}...${account.slice(-endPosition)}`}
    </span>
  );

  return (
    <div className={`${className} flex items-center justify-between`}>
      {isCopyBtnDisplay ? (
        <>
          <Tooltip title={account}>{shortAccount}</Tooltip>
          <CopyOutlined className='ml-2' style={{ cursor: 'copy' }} />
        </>
      ) : (
        shortAccount
      )}
    </div>
  );
}
