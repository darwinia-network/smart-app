// tslint:disable:no-magic-numbers
import BN from 'bn.js';
import { chunk, isNull, isNumber, isString, isUndefined } from 'lodash';

const DEFAULT_DECIMALS = 9;
const PRECISION = Math.pow(10, 9);

// tslint:disable-next-line: cyclomatic-complexity
const toString = (value: string | BN | number): string => {
  if (BN.isBN(value)) {
    return value.toString();
  } else if (isString(value)) {
    return value;
  } else if (isNumber(value)) {
    return String(value);
  } else if (isUndefined(value) || isNaN(value) || isNull(value)) {
    return '';
  } else {
    throw new TypeError(
      `Can not convert the value ${value} to String type. Value type if ${typeof value}`
    );
  }
};

const isDecimal = (value: number | string) => {
  return /\d+\.\d+/.test(String(value));
};

export function formatBalance(balance: string | BN | number): string {
  const origin = toString(balance);

  if (origin.length === 0 || origin === '0') {
    return '0';
  }

  if (Number.isSafeInteger(Number(origin))) {
    const value = Number(origin) / PRECISION;

    return prettyNumber(String(value));
  } else {
    const position = origin.length - DEFAULT_DECIMALS;
    const prefix = origin.slice(0, position + 1);
    const suffix = origin.substr(position, 3);

    return prettyNumber(`${prefix}.${suffix}`);
  }
}

export function prettyNumber(value: string): string {
  const isDecimalNumber = isDecimal(value);
  let prefix = isDecimalNumber ? value.split('.')[0] : value;
  const suffix = isDecimalNumber ? value.split('.')[1] : '000';

  prefix = chunk(prefix.split('').reverse(), 3)
    .reduce((acc: string[], cur: string[]) => [...acc, cur.reverse().join('')], [])
    .reverse()
    .join(',');

  return `${prefix}.${suffix}`;
}
