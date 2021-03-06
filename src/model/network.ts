import { Config } from './common';
import { AddEthereumChainParameter } from './metamask';

export type NetworkType = 'pangolin' | 'crab' | 'darwinia';

export type Token = 'ring' | 'kton';

// eslint-disable-next-line no-magic-numbers
export type SS58Prefix = 18 | 42;

interface Facade {
  logo: string;
  logoWithText: string;
}

type TokenRecord = { [key in Token]: string };

type Api = { [key: string]: string };

export interface NetConfig {
  dvmWithdrawAddress: TokenRecord;
  ethereumChain: AddEthereumChainParameter;
  facade: Facade;
  fullName: string;
  rpc: string;
  ss58Prefix: SS58Prefix;
  token: TokenRecord;
  erc20: TokenRecord;
  api: Api;
}

export type NetworkConfig<T = NetConfig> = Config<NetworkType, T>;

export type TxStatus =
  | 'future'
  | 'ready'
  | 'finalized'
  | 'finalitytimeout'
  | 'usurped'
  | 'dropped'
  | 'inblock'
  | 'invalid'
  | 'broadcast'
  | 'cancelled'
  | 'completed'
  | 'error'
  | 'incomplete'
  | 'queued'
  | 'qr'
  | 'retracted'
  | 'sending'
  | 'signing'
  | 'sent'
  | 'blocked';
