import { describe, it, expect } from 'vitest';
import { validateQuantity } from './validate';

function err(raw: string, rule: 'nonNegative' | 'positive' = 'nonNegative') {
  const r = validateQuantity('V', raw, rule);
  return r.ok ? null : r.error;
}

describe('validateQuantity', () => {
  it('accepts valid decimal numbers', () => {
    for (const [raw, value] of [['12', 12], ['0.5', 0.5], ['.5', 0.5], [' 3 ', 3], ['1e-3', 0.001], ['2.', 2]] as const) {
      const r = validateQuantity('V', raw, 'nonNegative');
      expect(r.ok).toBe(true);
      expect(r.ok ? r.value : NaN).toBe(value);
    }
  });

  it('rejects empty input with a clear message', () => {
    expect(err('')).toBe('Enter a value for V.');
    expect(err('   ')).toBe('Enter a value for V.');
  });

  it('rejects non-numbers', () => {
    for (const raw of ['abc', '1,5', '12V', '0x10', 'Infinity', 'NaN', '--3', '1e']) {
      expect(err(raw)).toBe('V must be a number, for example 12 or 0.5.');
    }
  });

  it('rejects negatives', () => {
    expect(err('-5')).toBe('V cannot be negative. This calculator works with magnitudes.');
  });

  it('applies the zero rule at the boundary', () => {
    expect(err('0', 'nonNegative')).toBeNull();
    expect(err('0', 'positive')).toBe('V must be greater than zero.');
    expect(err('0.000001', 'positive')).toBeNull();
  });

  it('rejects numbers too large to represent', () => {
    expect(err('1e999')).toBe('V is too large.');
  });
});
