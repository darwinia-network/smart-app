import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  darwinia: {
    // TODO
    facade: {
      logo: '/image/darwinia.svg',
      bgClsName: 'bg-darwinia',
      logoWithText: '/image/darwinia-logo.svg',
    },
    fullName: 'Darwinia Mainnet',
    ss58Prefix: 18,
    dvmWithdrawAddress: { ring: '', kton: '' },
    token: { ring: 'RING', kton: 'KTON' },
    erc20: {
      ring: '',
      kton: '',
    },
    rpc: 'wss://rpc.darwinia.network',
    ethereumChain: {
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
    fullName: 'Pangolin Testnet',
    ss58Prefix: 18,
    dvmWithdrawAddress: {
      ring: '0x0000000000000000000000000000000000000015',
      kton: '0x0000000000000000000000000000000000000016',
    },
    token: { ring: 'PRING', kton: 'PKTON' },
    erc20: {
      ring: '0xfe098c5eeDec594271618922B2F3364F0f8b1785',
      kton: '0x0eb47c5347B255e469101b9D71288b34DD5e2B95',
    },
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
    fullName: 'Crab Mainnet',
    ss58Prefix: 42,
    dvmWithdrawAddress: {
      ring: '0x0000000000000000000000000000000000000015',
      kton: '0x0000000000000000000000000000000000000016',
    },
    token: { ring: 'CRING', kton: 'CKTON' },
    erc20: {
      ring: '0x588abe3F7EE935137102C5e2B8042788935f4CB0',
      kton: '0xbfE9E136270cE46A2A6a8E8D54718BdAEBEbaA3D',
    },
    rpc: 'wss://crab-rpc.darwinia.network',
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
