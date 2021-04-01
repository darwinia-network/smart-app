import { partialRight } from 'lodash';
import { AccountType } from '../../model';

export function swap<T, U>(value: T | U, value1: U, value2: T): T | U {
  return value === value1 ? value2 : value1;
}

export function oppositeFactory<T, U>(value1: T, value2: U): (value: T | U) => T | U {
  return partialRight(swap, value1, value2);
}

export const toOppositeAccountType = oppositeFactory<AccountType, AccountType>('main', 'smart');
