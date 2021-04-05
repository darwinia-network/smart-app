import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';

export function Account({
  children,
  logoStyle,
  isLargeRounded = true,
  className = '',
  textClassName = '',
}: React.PropsWithChildren<{
  isLargeRounded?: boolean;
  logoStyle?: CSSProperties;
  className?: string;
  textClassName?: string;
}>) {
  const { t } = useTranslation();
  const { accountType } = useApi();
  const rounded = isLargeRounded ? 'rounded-xl ' : 'rounded-lg ';

  return (
    <div
      className={
        'flex items-center justify-between bg-main h-auto leading-normal gap-2 pl-4 ' +
        rounded +
        className
      }
    >
      <img
        src='/image/darwinia.7ff17f8e.svg'
        className='scale-150'
        style={logoStyle || { height: 32 }}
        alt=''
      />
      <span className={'text-purple-500 px-2 py-0.5 bg-white ' + rounded + textClassName}>
        {t(accountType)}
      </span>
      {children}
    </div>
  );
}
