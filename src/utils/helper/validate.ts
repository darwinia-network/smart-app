import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import Web3 from 'web3';
import { NETWORK_SS58_PREFIX } from '../../config';
import { AccountType } from '../../model';
import { canConvertToDvm, convertToDvm, convertToSS58, dvmAddressToAccountId } from './address';

// tslint:disable-next-line: cyclomatic-complexity
export const isValidAddress = (address: string, accountType: AccountType): boolean => {
  if (accountType === 'substrate') {
    const isDvm = Web3.utils.isAddress(address);
    const isSS58 = isSS58Address(address);

    return isDvm || (isSS58 && canConvertToDvm(address));
  }

  if (accountType === 'smart') {
    return isSS58Address(address);
  }

  return false;
};

export const isSS58Address = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};

// tslint:disable-next-line: cyclomatic-complexity
export const isSameAddress = (from: string, to: string): boolean => {
  if (from === to) {
    return true;
  }

  let toAddress: string = to;
  let fromAddress: string = from;

  if (Web3.utils.isAddress(from)) {
    toAddress = convertToDvm(to);
  }

  if (isSS58Address(from)) {
    if (Web3.utils.isAddress(to)) {
      toAddress = dvmAddressToAccountId(to).toHuman();
    }

    if (isSS58Address(to)) {
      toAddress = convertToSS58(to, NETWORK_SS58_PREFIX.darwinia);
      fromAddress = convertToSS58(from, NETWORK_SS58_PREFIX.darwinia);
    }
  }

  return fromAddress === toAddress;
};
