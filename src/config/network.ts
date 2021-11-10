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
      kton: '0x0000000000000000000000000000000000000015',
      ring: '0x0000000000000000000000000000000000000015',
    },
    erc20: {
      kton: '0x159933C635570D5042723359fbD1619dFe83D3f3',
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
      kton: '0xc8C1680B18D432732D07c044669915726fAF67D0',
      ring: '0xbBD91aD844557ADCbb97296216b3B3c977FCC4F2',
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
