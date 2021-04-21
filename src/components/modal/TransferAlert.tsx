import { Button, Checkbox, CheckboxOptionType, Modal } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';
import { toOppositeAccountType } from '../../utils';
import { IModalProps } from './interface';

const options: CheckboxOptionType[] = [
  {
    label:
      'I am trying to transfer from 「Darwinia {{fromAccountType}} address 」to 「Darwinia {{toAccountType}} address」.',
    value: 'direction',
  },
  {
    label: 'I have confirmed that the「Darwinia {{toAccountType}} address」{{toAccount}}',
    value: 'safe',
  },
  {
    label:
      'I have confirmed that the address above is not an exchange address or cloud wallet address.',
    value: 'notExchange',
  },
];

const defaultChecked: string[] = ['direction'];

export function TransferAlertModal({
  isVisible,
  cancel,
  confirm,
  recipient,
}: IModalProps & { recipient: string }) {
  const { t } = useTranslation();
  const [checkedList, setCheckedList] = useState(defaultChecked);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { accountType } = useApi();
  const optionsTrans = useMemo(
    () =>
      options.map(({ label, ...others }) => ({
        ...others,
        label: t(label as string, {
          fromAccountType: t(accountType),
          toAccountType: t(toOppositeAccountType(accountType)),
          toAccount: recipient,
        }),
      })),
    [accountType, t, recipient]
  );
  const onCancel = useCallback(() => {
    setCheckedList(defaultChecked);
    setIsAllSelected(false);
    cancel();
  }, [cancel]);
  const onConfirm = useCallback(() => {
    setCheckedList(defaultChecked);
    setIsAllSelected(false);
    confirm();
  }, [confirm]);

  return (
    <Modal
      title={t('Attention')}
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button className='w-1/2' key='cancel-btn' onClick={onCancel}>
          {t('Cancel')}
        </Button>,
        <Button
          key='primary-btn'
          type='primary'
          onClick={onConfirm}
          disabled={!isAllSelected}
          className='w-1/2 rounded-xl'
        >
          {t('Next')}
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
