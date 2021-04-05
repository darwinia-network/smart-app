import { Assets } from './common';

export interface TransferFormValues {
  recipient: string;
  assets: Assets;
  amount: string;
}
