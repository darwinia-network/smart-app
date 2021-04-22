import { Card } from 'antd';
import { Trans } from 'react-i18next';
import { TransferForm } from '../components/TransferForm';

export function Transfer() {
  return (
    <Card
      title={<Trans>DVM smart contract</Trans>}
      className='xl:w-1/3 lg:1/2 md:w-2/3 w-full mx-auto'
      style={{ maxWidth: 420 }}
    >
      <TransferForm></TransferForm>
    </Card>
  );
}
