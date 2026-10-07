import { cleanFloat } from '../units/units';

/** E12 preferred values (10% series), as a mantissa from 1.0 up to 8.2. */
export const E12_MANTISSAS: readonly number[] = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

/** Smallest E12 value that is not below `ohms` (so a series resistor never lets more current through than planned). */
export function nextE12AtLeast(ohms: number): number {
  if (!Number.isFinite(ohms) || ohms <= 0) throw new RangeError('ohms must be a positive finite number');
  const decade = Number(ohms.toExponential(11).split('e')[1]);
  const x = ohms / 10 ** decade;
  // The tiny allowance stops a value like 150.0000000001 jumping to the next step.
  const found = E12_MANTISSAS.find((m) => m >= x * (1 - 1e-9));
  return cleanFloat((found ?? 10) * 10 ** decade);
}
