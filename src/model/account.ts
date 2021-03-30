import { Config } from './common';

export type AccountType = 'main' | 'smart';

export type AccountConfig<T> = Config<AccountType, T>;
