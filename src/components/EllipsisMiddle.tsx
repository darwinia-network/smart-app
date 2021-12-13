import { Typography } from 'antd';
import { PropsWithChildren } from 'react';

export function EllipsisMiddle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`w-full whitespace-nowrap ${className}`}>
      <span
        className='whitespace-nowrap overflow-hidden align-middle inline-block overflow-ellipsis'
        style={{ width: 'calc(37.5% + 1.2em)' }}
      >
        {children}
      </span>
      <Typography.Text
        className='whitespace-nowrap overflow-hidden align-middle inline-flex justify-end'
        copyable
        style={{ width: 'calc(37.5% - 1.45em)', marginLeft: '-0.35em', color: 'inherit' }}
      >
        {children}
      </Typography.Text>
    </div>
  );
}
