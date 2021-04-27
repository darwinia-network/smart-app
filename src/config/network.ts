import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  darwinia: {
    facade: {
      logo: '/image/darwinia.svg',
      bgClsName: 'bg-darwinia',
      logoWithText: '/image/darwinia-logo.svg',
    },
    ids: ['1'],
    ss58Prefix: 18,
    token: { ring: 'RING', kton: 'KTON' },
  },
  pangolin: {
    facade: {
      logo: '/image/pangolin.svg',
      bgClsName: 'bg-pangolin',
      logoWithText: '/image/pangolin-logo.svg',
    },
    ids: ['43', '44'],
    ss58Prefix: 18,
    token: { ring: 'PRING', kton: 'PKTON' },
  },
  crab: {
    facade: {
      logo: '/image/crab.svg',
      bgClsName: 'bg-crab',
      logoWithText: '/image/crab-logo.svg',
    },
    ids: ['44'],
    ss58Prefix: 42,
    token: { ring: 'CRING', kton: 'CKTON' },
  },
};
