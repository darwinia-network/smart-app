import React, { CSSProperties, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_STYLE_CONFIG } from '../config/network';
import { useApi } from '../hooks';
import { useAssets } from '../hooks/assets';
import { clsName } from '../utils';
import { AccountModal } from './modal/Account';

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
  const { accountType, network } = useApi();
  const rounded = isLargeRounded ? 'rounded-xl ' : 'rounded-lg ';
  const [isVisible, setIsVisible] = useState(false);
  const { assets } = useAssets();
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
    <>
      <div
        className={containerCls}
        onClick={(event) => {
          // tslint:disable-next-line: no-any
          if ((event.target as any).nodeName !== 'svg') {
            setIsVisible(true);
          }
        }}
      >
        <img
          src={NETWORK_STYLE_CONFIG[network].logo}
          className='scale-150'
          style={logoStyle || { height: 32 }}
          alt=''
        />
        <span className={accountCls}>{t(accountType)}</span>
        {children}
      </div>
      <AccountModal assets={assets} isVisible={isVisible} cancel={() => setIsVisible(false)} />
    </>
  );
}
