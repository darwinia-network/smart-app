import { Input, InputProps } from 'antd';
import { CustomFormControlProps } from '../model';

export function Balance({ value, onChange, ...others }: CustomFormControlProps & InputProps) {
  return (
    <Input
      {...others}
      value={value}
      onChange={(event) => {
        const current = event.target.value.replace(/,/g, '');

        onChange(current);
      }}
    />
  );
}
