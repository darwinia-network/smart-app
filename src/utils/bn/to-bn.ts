import BN from 'bn.js';
import { PRECISION } from '../../config';

// tslint:disable-next-line: no-magic-numbers
const TEN = new BN(10);

export function toBn(input: string): BN {
  /**
   * results of BN do not match expectations when using thousandths numbers
   * new BN(10232.23).toString() ---> 10232  ✔
   * new BN(10,232.23).toString() ---> 10 x
   */
  input = input.replace(',', '');

  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);
  const siUnitPower = 0;
  const basePower = PRECISION;
  const siPower = new BN(basePower);

  let result: BN = null;

  if (isDecimalValue) {
    // tslint:disable-next-line: no-magic-numbers
    if (siUnitPower - isDecimalValue[2].length < -basePower) {
      result = new BN(-1);
    }

    const div = new BN(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '');
    const mod = new BN(modString);

    result = div
      .mul(TEN.pow(siPower))
      .add(mod.mul(TEN.pow(new BN(basePower + siUnitPower - modString.length))));
  } else {
    result = new BN(input.replace(/[^\d]/g, '')).mul(TEN.pow(siPower));
  }

  return result;
}
