import { message, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import { copyTextToClipboard } from '../utils';
import { clsName } from '../utils';
import { CopyIcon } from './icons';

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
          <AccountType className='sm:inline hidden' />
          <Tooltip title={account}>{shortAccount}</Tooltip>
          <CopyIcon
            onClick={(event) => {
              event.stopPropagation();
              copyTextToClipboard(account).then(() => {
                message.success(t('Copied'));
              });
            }}
            className='ml-2 enlarge-hot-area hidden md:block'
          />
        </>
      ) : (
        shortAccount
      )}
    </div>
  );
}

interface AccountTypeProps {
  className?: string;
  isLargeRounded?: boolean;
}

function AccountType({ className = '', isLargeRounded = false }: AccountTypeProps) {
  const { accountType, networkConfig } = useApi();
  const accountCls = useMemo(
    () =>
      clsName(
        'text-white px-2 py-0.5 mr-1 hidden md:inline capitalize',
        isLargeRounded ? 'rounded-xl ' : 'rounded-lg ',
        className,
        networkConfig.facade.bgClsName
      ),
    [isLargeRounded, className, networkConfig.facade.bgClsName]
  );

  return <span className={accountCls}>{accountType}</span>;
}
