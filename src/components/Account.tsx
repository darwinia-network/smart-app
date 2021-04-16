import React, { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_STYLE_CONFIG } from '../config/network';
import { useApi } from '../hooks';
import { clsName } from '../utils';

export function Account({
  children,
  logoStyle,
  isLargeRounded = true,
  className = '',
  textClassName = '',
  onClick = () => {},
}: React.PropsWithChildren<{
  isLargeRounded?: boolean;
  logoStyle?: CSSProperties;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}>) {
  const { t } = useTranslation();
  const { accountType, network } = useApi();
  const rounded = isLargeRounded ? 'rounded-xl ' : 'rounded-lg ';
  const containerCls = useMemo(
    () =>
      clsName(
        'flex items-center justify-between h-auto leading-normal gap-2 pl-4 whitespace-nowrap',
        rounded,
        className,
        NETWORK_STYLE_CONFIG[network].bgClsName
      ),
    [rounded, className, network]
  );
  const accountCls = useMemo(
    () => clsName('text-purple-500 px-2 py-0.5 bg-white', rounded, textClassName),
    [rounded, textClassName]
  );

  return (
    <div className={containerCls} onClick={onClick}>
      <img
        src={NETWORK_STYLE_CONFIG[network].logo}
        className='scale-150'
        style={logoStyle || { height: 32 }}
        alt=''
      />
      <span className={accountCls}>{t(accountType)}</span>
      {children}
    </div>
  );
}
