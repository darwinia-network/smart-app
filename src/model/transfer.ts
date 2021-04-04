import { Assets } from './common';

export interface TransferFormValues {
  receiveAddress: string;
  assets: Assets;
  amount: string;
}
