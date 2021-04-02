import { Config } from './common';

export type NetworkType = 'pangolin' | 'crab' | 'darwinia';

export type NetworkConfig<T> = Config<NetworkType, T>;
