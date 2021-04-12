import { CopyOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { copyTextToClipboard } from '../utils';

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
  const { t } = useTranslation();
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
          <CopyOutlined
            onClick={() => {
              copyTextToClipboard(account).then(() => {
                message.success(t('Success copied'));
              });
            }}
            className='ml-2'
            style={{ cursor: 'copy' }}
          />
        </>
      ) : (
        shortAccount
      )}
    </div>
  );
}
