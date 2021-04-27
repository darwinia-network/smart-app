import React, { CSSProperties, useMemo } from 'react';
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
  const { accountType, networkConfig } = useApi();
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
  const accountCls = useMemo(
    () =>
      clsName(
        'text-purple-500 px-2 bg-white mr-1 hidden md:inline capitalize',
        isLargeRounded ? 'rounded-xl ' : 'rounded-md ',
        textClassName
      ),
    [isLargeRounded, textClassName]
  );

  return (
    <div className={containerCls} onClick={onClick} style={containerStyle || {}}>
      <img
        src={networkConfig.facade.logo}
        style={logoStyle || { height: 32 }}
        className='hidden sm:inline-block'
        alt=''
      />
      <span className={accountCls}>{accountType}</span>
      {children}
    </div>
  );
}
