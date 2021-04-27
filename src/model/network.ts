import { Config } from './common';

export type NetworkType = 'pangolin' | 'crab' | 'darwinia';

// tslint:disable-next-line: no-magic-numbers
export type SS58Prefix = 18 | 42;

interface Facade {
  logo: string;
  bgClsName: string;
  logoWithText: string;
}

type Ids = string[];

interface Token {
  ring: string;
  kton: string;
}

export interface NetConfig {
  facade: Facade;
  ids: Ids;
  ss58Prefix: SS58Prefix;
  token: Token;
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
