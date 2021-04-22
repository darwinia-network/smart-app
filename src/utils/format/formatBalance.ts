import Bignumber from 'bignumber.js';
// tslint:disable:no-magic-numbers
import BN from 'bn.js';
import { isNull, isNumber, isString, isUndefined, toNumber } from 'lodash';
import Web3 from 'web3';
import { PRECISION } from '../../config';
import { AccountType } from '../../model';

// tslint:disable-next-line: cyclomatic-complexity
const toString = (value: string | BN | number): string => {
  if (BN.isBN(value)) {
    return value.toString();
  } else if (isString(value)) {
    return value;
  } else if (isNumber(value)) {
    return String(value);
  } else if (isUndefined(value) || isNaN(value) || isNull(value)) {
    return '0';
  } else {
    throw new TypeError(
      `Can not convert the value ${value} to String type. Value type if ${typeof value}`
    );
  }
};

const isDecimal = (value: number | string) => {
  return /\d+\.\d+/.test(String(value));
};

export function formatBalance(balance: string | BN | number, accountType: AccountType): string {
  if (accountType === 'substrate') {
    return precisionBalance(balance);
  }

  if (accountType === 'smart') {
    const num = new Bignumber(Web3.utils.fromWei(toString(balance)));

    return parseFloat(num.eq(new Bignumber(0)) ? '0' : num.toFixed(4)) + '';
  }

  return '';
}

/**
 *
 * @param balance - balance
 * @param withThousandSplit  - whether to  use thousands separator in result
 * @returns string type balance
 */
export function precisionBalance(balance: string | BN | number, withThousandSplit = true): string {
  const origin = toString(balance);

  if (origin.length === 0 || origin === '0') {
    return '0';
  }

  let result: string = null;

  if (Number.isSafeInteger(Number(origin))) {
    result = (Number(origin) / Math.pow(10, PRECISION)).toString();
  } else {
    const position = origin.length - PRECISION;
    const prefix = origin.slice(0, position + 1);
    const suffix = origin.substr(position, 3);

    result = `${prefix}.${suffix}`;
  }

  return withThousandSplit ? prettyNumber(result) : result;
}

export interface PrettyNumberOptions {
  noDecimal?: boolean;
  decimal?: number;
}

export function prettyNumber(
  value: string,
  { decimal, noDecimal }: PrettyNumberOptions = { decimal: 3, noDecimal: false }
): string {
  const isDecimalNumber = isDecimal(value);
  let prefix = isDecimalNumber ? value.split('.')[0] : value;
  const suffix = isDecimalNumber
    ? completeDecimal(value.split('.')[1], decimal)
    : new Array(decimal).fill(0).join('');

  prefix = prefix.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');

  return !noDecimal ? `${prefix}.${suffix}` : prefix;
}

const completeDecimal = (value: string, bits: number): string => {
  const length = value.length;

  if (length > bits) {
    return value.substr(0, bits);
  } else if (length < bits) {
    return value + new Array(bits - length).fill('0').join('');
  } else {
    return value;
  }
};
