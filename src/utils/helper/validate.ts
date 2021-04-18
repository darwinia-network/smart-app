import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import Web3 from 'web3';
import { AccountType } from '../../model';

// tslint:disable-next-line: cyclomatic-complexity
export const isValidAddress = (address: string, accountType: AccountType): boolean => {
  if (accountType === 'substrate') {
    const isDvmAddress = Web3.utils.isAddress(address);
    const isSS58Address = isValidPolkadotAddress(address);

    return isDvmAddress || isSS58Address;
  }

  if (accountType === 'smart') {
    return isValidPolkadotAddress(address);
  }

  return false;
};

export const isValidPolkadotAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};
