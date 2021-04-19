import { TypeRegistry } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { hexToU8a, numberToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { NETWORK_SS58_PREFIX } from './../../config/network';
import { ValueOf } from './../../model/util';

export const registry = new TypeRegistry();

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

export function convertToSS58(
  text: string,
  prefix: ValueOf<typeof NETWORK_SS58_PREFIX>,
  isShort = false
): string {
  if (!text) {
    return '';
  }

  try {
    let address = encodeAddress(text, prefix);
    const length = 8;

    if (isShort) {
      address = address.substr(0, length) + '...' + address.substr(address.length - length, length);
    }

    return address;
  } catch (error) {
    return '';
  }
}

export function canConvertToDvm(address: string): boolean {
  return !!convertToDvm(address);
}

export function convertToDvm(address: string): string {
  if (!address) {
    return '';
  }

  const startAt = 2;
  const result = u8aToHex(decodeAddress(address)).slice(startAt);
  const PREFIX = '64766d3a00000000000000';

  // tslint:disable-next-line: no-magic-numbers
  return result.startsWith(PREFIX) ? '0x' + result.slice(-42) : null;
}
