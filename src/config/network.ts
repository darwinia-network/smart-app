import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  crab: {
    api: {
      subql: 'https://api.subquery.network/sq/darwinia-network/smart-app-crab',
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
      subql: 'https://undepolyment',
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
      subql: 'https://api.subquery.network/sq/darwinia-network/smart-app-pangolin',
    },
    dvmWithdrawAddress: {
      kton: '0x0000000000000000000000000000000000000015',
      ring: '0x0000000000000000000000000000000000000015',
    },
    erc20: {
      kton: '0x8809f9b3ACEF1dA309f49b5Ab97A4C0faA64E6Ae',
      ring: '0xc52287b259b2431ba0f61BC7EBD0eD793B0b7044',
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
    ss58Prefix: 42,
    token: {
      kton: 'PKTON',
      ring: 'PRING',
    },
  },
};
