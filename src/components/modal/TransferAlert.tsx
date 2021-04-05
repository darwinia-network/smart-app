import { Button, Checkbox, CheckboxOptionType, Modal } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';
import { TransferFormValues } from '../../model/transfer';
import { toOppositeAccountType } from '../../utils';
import { IModalProps } from './interface';

const options: CheckboxOptionType[] = [
  {
    label:
      'I want to transfer from darwinia {{fromAccountType}} account to darwinia {{toAccountType}} account',
    value: 'direction',
  },
  {
    label: 'I have confirmed that the darwinia {{toAccount}} account is safe and available.',
    value: 'safe',
  },
  {
    label:
      'I have confirmed that the address above is not an exchange address or cloud wallet address.',
    value: 'notExchange',
  },
];

export function TransferAlertModal({
  isVisible,
  cancel,
  confirm,
  recipient,
}: IModalProps & { recipient: string }) {
  const { t } = useTranslation();
  const [checkedList, setCheckedList] = useState(['direction']);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { accountType } = useApi();
  const optionsTrans = useMemo(
    () =>
      options.map(({ label, ...others }) => ({
        ...others,
        label: t(label as string, {
          fromAccountType: accountType,
          toAccountType: toOppositeAccountType(accountType),
          toAccount: recipient,
        }),
      })),
    [accountType, t, recipient]
  );

  return (
    <Modal
      title={t('Attention')}
      visible={isVisible}
      onCancel={cancel}
      footer={[
        <Button className='w-1/2' key='cancel-btn' onClick={cancel}>
          {t('Cancel')}
        </Button>,
        <Button
          key='primary-btn'
          type='primary'
          onClick={confirm}
          disabled={!isAllSelected}
          className='w-1/2 rounded-xl'
        >
          {t('Next Step')}
        </Button>,
      ]}
      wrapClassName='large-footer-btn'
    >
      <Checkbox.Group
        options={optionsTrans}
        value={checkedList}
        onChange={(list) => {
          setCheckedList(list as string[]);
          setIsAllSelected(list.length === options.length);
        }}
      />
    </Modal>
  );
}
