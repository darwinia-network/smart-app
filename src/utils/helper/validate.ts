import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import Web3 from 'web3';
import { AccountType } from '../../model';

export const isValidAddress = (address: string, accountType: AccountType): boolean => {
  if (accountType === 'main') {
    return Web3.utils.isAddress(address);
  }

  if (accountType === 'smart') {
    return isValidAddressPolkadotAddress(address);
  }

  return false;
};

export const isValidAddressPolkadotAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};
