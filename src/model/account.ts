import type ExtType from '@polkadot/extension-inject/types';
import { Config, WithOptional } from './common';

export type AccountType = 'substrate' | 'smart';

export type AccountConfig<T> = Config<AccountType, T>;

export type IAccountMeta = WithOptional<ExtType.InjectedAccountWithMeta, 'meta'>;
