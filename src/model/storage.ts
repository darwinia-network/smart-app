import { THEME } from '../config';
import { AccountType } from './account';
import { NetworkType } from './network';

export interface StorageInfo {
  network?: NetworkType;
  theme?: THEME;
  accountType?: AccountType;
}
