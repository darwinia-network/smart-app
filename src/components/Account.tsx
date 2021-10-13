import React, { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';

export function Account({
  children,
  logoStyle,
  containerStyle,
  isLargeRounded = true,
  className = '',
  onClick = () => {
    // do nothing
  },
}: React.PropsWithChildren<{
  isLargeRounded?: boolean;
  logoStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}>) {
  const { networkConfig, network } = useApi();
  const containerCls = useMemo(
    () =>
      `flex items-center justify-between leading-normal whitespace-nowrap bg-${network} 
        ${isLargeRounded ? 'rounded-xl ' : 'rounded-lg '}
        ${className}`,
    [isLargeRounded, className, network]
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
      <span className='text-white mr-2 hidden sm:inline'>{t(networkConfig.fullName)}</span>
      {children}
    </div>
  );
}
