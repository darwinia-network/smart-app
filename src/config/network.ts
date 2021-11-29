import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  crab: {
    api: {
      subql: 'https://api.subquery.network/sq/darwinia-network/crab',
    },
    dvmWithdrawAddress: {
      kton: '0x0000000000000000000000000000000000000016',
      ring: '0x0000000000000000000000000000000000000015',
    },
    erc20: {
      kton: '0xbfE9E136270cE46A2A6a8E8D54718BdAEBEbaA3D',
      ring: '0x588abe3F7EE935137102C5e2B8042788935f4CB0',
    },
    ethereumChain: {
      blockExplorerUrls: ['https://crab.subscan.io/'],
      chainId: '0x2c',
      chainName: 'crab',
      iconUrls: [],
      nativeCurrency: {
        decimals: 18,
        name: 'Crab Network Native Token',
        symbol: 'CRAB',
      },
      rpcUrls: ['https://crab-rpc.darwinia.network/'],
    },
    facade: {
      logo: '/image/crab.svg',
      logoWithText: '/image/crab-logo.svg',
    },
    fullName: 'Crab',
    rpc: 'wss://crab-rpc.darwinia.network',
    ss58Prefix: 42,
    token: {
      kton: 'CKTON',
      ring: 'CRAB',
    },
  },
  darwinia: {
    api: {
      subql: 'https://api.subquery.network/sq/darwinia-network/darwinia',
    },
    dvmWithdrawAddress: {
      kton: '',
      ring: '',
    },
    erc20: {
      kton: '',
      ring: '',
    },
    ethereumChain: {
      blockExplorerUrls: [''],
      chainId: '',
      chainName: 'darwinia',
      iconUrls: [],
      nativeCurrency: {
        decimals: 18,
        name: '',
        symbol: '',
      },
      rpcUrls: [],
    },
    // TODO
    facade: {
      logo: '/image/darwinia.svg',
      logoWithText: '/image/darwinia-logo.svg',
    },
    fullName: 'Darwinia',
    rpc: 'wss://rpc.darwinia.network',
    ss58Prefix: 18,
    token: {
      kton: 'KTON',
      ring: 'RING',
    },
  },
  pangolin: {
    api: {
      subql: 'https://api.subquery.network/sq/darwinia-network/pangolin',
    },
    dvmWithdrawAddress: {
      kton: '0x0000000000000000000000000000000000000015',
      ring: '0x0000000000000000000000000000000000000015',
    },
    erc20: {
      kton: '0xDCd3bC4138afE6F324eaA12C356A20cD576edF08',
      ring: '0xcfDEb76be514c8B8DC8B509E63f95E34ebafD81e',
    },
    ethereumChain: {
      blockExplorerUrls: ['https://pangolin.subscan.io/'],
      chainId: '0x2b',
      chainName: 'pangolin',
      iconUrls: [],
      nativeCurrency: {
        decimals: 18,
        name: 'Pangolin Network Native Token',
        symbol: 'PRING',
      },
      rpcUrls: ['https://pangolin-rpc.darwinia.network/'],
    },
    facade: {
      logo: '/image/pangolin.svg',
      logoWithText: '/image/pangolin-logo.svg',
    },
    fullName: 'Pangolin',
    rpc: 'wss://pangolin-rpc.darwinia.network/',
    ss58Prefix: 18,
    token: {
      kton: 'PKTON',
      ring: 'PRING',
    },
  },
};
