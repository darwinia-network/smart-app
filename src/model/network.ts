import { Config } from './common';

export type NetworkType = 'pangolin' | 'crab' | 'darwinia' | 'main';

export type NetworkConfig<T> = Config<NetworkType, T>;
