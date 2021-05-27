import React, { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import { clsName } from '../utils';

export function Account({
  children,
  logoStyle,
  containerStyle,
  isLargeRounded = true,
  className = '',
  textClassName = '',
  onClick = () => {},
}: React.PropsWithChildren<{
  isLargeRounded?: boolean;
  logoStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}>) {
  const { networkConfig } = useApi();
  const containerCls = useMemo(
    () =>
      clsName(
        'flex items-center justify-between leading-normal whitespace-nowrap',
        isLargeRounded ? 'rounded-xl ' : 'rounded-lg ',
        className,
        networkConfig.facade.bgClsName
      ),
    [isLargeRounded, className, networkConfig]
  );
  const { t } = useTranslation();

  return (
    <div className={containerCls} onClick={onClick} style={containerStyle || {}}>
      <img
        src={networkConfig.facade.logo}
        style={logoStyle || { height: 32 }}
        className='hidden sm:inline-block'
        alt=''
      />
      <span className='text-white mr-2 ml-1 hidden sm:inline'>{t(networkConfig.fullName)}</span>
      {children}
    </div>
  );
}
