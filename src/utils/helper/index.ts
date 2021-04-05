import { TypeRegistry } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { hexToU8a, numberToU8a, stringToU8a } from '@polkadot/util';
import { partialRight } from 'lodash';
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
