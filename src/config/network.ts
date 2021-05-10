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
    ss58Prefix: 18,
    token: { ring: 'RING', kton: 'KTON' },
    rpc: 'wss://rpc.darwinia.network',
    ethereumChain: {
      // TODO
      chainId: '',
      chainName: 'darwinia',
      iconUrls: [],
      nativeCurrency: {
        name: '',
        symbol: '',
        decimals: 18,
      },
      rpcUrls: [],
      blockExplorerUrls: [''],
    },
  },
  pangolin: {
    facade: {
      logo: '/image/pangolin.svg',
      bgClsName: 'bg-pangolin',
      logoWithText: '/image/pangolin-logo.svg',
    },
    ss58Prefix: 18,
    token: { ring: 'PRING', kton: 'PKTON' },
    rpc: 'wss://pangolin-rpc.darwinia.network/',
    ethereumChain: {
      chainId: '0x2b',
      chainName: 'pangolin',
      iconUrls: [],
      nativeCurrency: {
        name: 'Pangolin Network Native Token',
        symbol: 'PRING',
        decimals: 18,
      },
      rpcUrls: ['https://pangolin-rpc.darwinia.network/'],
      blockExplorerUrls: ['https://pangolin.subscan.io/'],
    },
  },
  crab: {
    facade: {
      logo: '/image/crab.svg',
      bgClsName: 'bg-crab',
      logoWithText: '/image/crab-logo.svg',
    },
    ss58Prefix: 42,
    token: { ring: 'CRING', kton: 'CKTON' },
    rpc: 'wss://crab.darwinia.network',
    ethereumChain: {
      chainId: '0x2c',
      chainName: 'crab',
      iconUrls: [],
      nativeCurrency: {
        name: 'Crab Network Native Token',
        symbol: 'CRING',
        decimals: 18,
      },
      rpcUrls: ['https://crab-rpc.darwinia.network/'],
      blockExplorerUrls: ['https://crab.subscan.io/'],
    },
  },
};
