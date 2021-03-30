import { cloneDeep } from 'lodash';
import { NetworkType } from '../model';

const commonType = {
  Signer: 'EthereumAddress',
  RelayAuthorityT: {
    accountId: 'AccountId',
    signer: 'Signer',
    stake: 'Balance',
    term: 'BlockNumber',
  },
  MMRRoot: 'Hash',
  EcdsaAddress: 'EthereumAddress',
};

const pangolinType = cloneDeep(commonType);

const darwiniaType = cloneDeep(commonType);

const crabType = cloneDeep(commonType);

export const NETWORK_TYPE: { [key in NetworkType]: typeof commonType } = {
  crab: crabType,
  main: darwiniaType,
  pangolin: pangolinType,
  darwinia: darwiniaType,
};
