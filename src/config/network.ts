import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_STYLE_CONFIG: NetworkConfig<{
  logo: string;
  bgClsName: string;
  logoWithText: string;
}> = {
  crab: { logo: '/image/crab.svg', bgClsName: 'bg-crab', logoWithText: '/image/crab-logo.svg' },
  darwinia: {
    logo: '/image/darwinia.svg',
    bgClsName: 'bg-darwinia',
    logoWithText: '/image/darwinia-logo.svg',
  },
  pangolin: {
    logo: '/image/pangolin.svg',
    bgClsName: 'bg-pangolin',
    logoWithText: '/image/pangolin-logo.svg',
  },
};

export const NETWORK_IDS: NetworkConfig<string[]> = {
  darwinia: ['1'],
  pangolin: ['43', '44'],
  crab: ['NaN'],
};

export const NETWORK_SS58_PREFIX: NetworkConfig<number> = {
  darwinia: 18,
  pangolin: 18,
  crab: 42,
};

export const NETWORK_TOKEN_NAME: NetworkConfig<{ ring: string; kton: string }> = {
  darwinia: { ring: 'RING', kton: 'KTON' },
  crab: { ring: 'CRING', kton: 'CKTON' },
  pangolin: { ring: 'PRING', kton: 'PKTON' },
};
