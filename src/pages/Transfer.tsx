import { Card } from 'antd';
import React from 'react';
import { Trans } from 'react-i18next';
import { TransferForm } from '../components/TransferForm';

export function Transfer() {
  return (
    <Card
      title={<Trans>DVM smart transfer</Trans>}
      className='xl:w-1/3 lg:w-1/2 sm:w-full mx-auto rounded-xl'
    >
      <TransferForm></TransferForm>
    </Card>
  );
}
