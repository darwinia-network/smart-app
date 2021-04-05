import React, { CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import { useAssets } from '../hooks/assets';
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
  const { accountType } = useApi();
  const rounded = isLargeRounded ? 'rounded-xl ' : 'rounded-lg ';
  const [isVisible, setIsVisible] = useState(false);
  const { assets } = useAssets();

  return (
    <>
      <div
        className={
          'flex items-center justify-between bg-main h-auto leading-normal gap-2 pl-4 ' +
          rounded +
          className
        }
        onClick={() => setIsVisible(true)}
      >
        <img
          src='/image/darwinia.svg'
          className='scale-150'
          style={logoStyle || { height: 32 }}
          alt=''
        />
        <span className={'text-purple-500 px-2 py-0.5 bg-white ' + rounded + textClassName}>
          {t(accountType)}
        </span>
        {children}
      </div>
      <AccountModal assets={assets} isVisible={isVisible} cancel={() => setIsVisible(false)} />
    </>
  );
}
