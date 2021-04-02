import { Input, InputProps } from 'antd';
import { useState } from 'react';
import { CustomFormControlProps } from '../model';
import { prettyNumber } from '../utils/format/formatBalance';

export function Balance({
  value,
  onChange,
  defaultValue,
  isThousandsMode = false,
  // tslint:disable-next-line: trailing-comma
  ...others
}: CustomFormControlProps & InputProps & { isThousandsMode?: boolean }) {
  const [state, setState] = useState('');

  return (
    <Input
      {...others}
      value={state || defaultValue}
      onChange={(event) => {
        const current = event.target.value.replace(/,/g, '');

        setState(isThousandsMode ? prettyNumber(current, { noDecimal: true }) : current);

        onChange(current);
      }}
    />
  );
}
