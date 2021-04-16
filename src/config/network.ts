import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_STYLE_CONFIG: NetworkConfig<{ logo: string; bgClsName: string }> = {
  crab: { logo: '/image/crab.svg', bgClsName: 'bg-crab' },
  darwinia: { logo: '/image/darwinia.svg', bgClsName: 'bg-darwinia' },
  pangolin: { logo: '/image/pangolin.svg', bgClsName: 'bg-pangolin' },
};

export enum NetworkIds {
  darwinia = '1',
  pangolin = '43',
  crab = 'NaN',
}

export const NETWORK_SS58_PREFIX: NetworkConfig<number> = {
  darwinia: 18,
  pangolin: 18,
  crab: 42,
};
