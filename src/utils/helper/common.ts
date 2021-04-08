import { TypeRegistry } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { hexToU8a, numberToU8a, stringToU8a } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';
import { partialRight } from 'lodash';
import { S58_PREFIX } from '../../config';
import { AccountType } from '../../model';

export const registry = new TypeRegistry();

export function swap<T, U>(value: T | U, value1: U, value2: T): T | U {
  return value === value1 ? value2 : value1;
}

export function oppositeFactory<T, U>(value1: T, value2: U): (value: T | U) => T | U {
  return partialRight(swap, value1, value2);
}

export const toOppositeAccountType = oppositeFactory<AccountType, AccountType>('main', 'smart');

export function dvmAddressToAccountId(address: string | null | undefined): AccountId {
  if (!address) {
    return registry.createType('AccountId', '');
  }

  // tslint:disable-next-line: no-magic-numbers
  const data = new Uint8Array(32);

  data.set(stringToU8a('dvm:'));
  // tslint:disable-next-line: no-magic-numbers
  data.set(hexToU8a(address), 11);
  // tslint:disable-next-line: no-bitwise
  const checksum = data.reduce((pre: number, current: number): number => pre ^ current);

  // tslint:disable-next-line: no-magic-numbers
  data.set(numberToU8a(checksum), 31);
  const accountId = registry.createType('AccountId', data);

  return accountId;
}

/**
 * @param common - cls names that do not depend on network
 * @param classes - cls names that depend on network
 * @returns - calculated class name
 */
export function clsName(common: string, ...classes: string[]): string {
  return [...common.split(' '), ...classes.filter((name) => !!name)].join(' ');
}

export function convertSS58Address(text: string, isShort = false): string {
  if (!text) {
    return '';
  }

  try {
    let address = encodeAddress(text, S58_PREFIX);
    const length = 8;

    if (isShort) {
      address = address.substr(0, length) + '...' + address.substr(address.length - length, length);
    }

    return address;
  } catch (error) {
    return '';
  }
}
