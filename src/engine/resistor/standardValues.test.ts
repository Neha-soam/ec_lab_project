import { describe, it, expect } from 'vitest';
import { nextE12AtLeast } from './standardValues';

describe('nextE12AtLeast', () => {
  it('keeps values that are already standard', () => {
    for (const v of [10, 150, 4700, 0.47, 1000000]) expect(nextE12AtLeast(v)).toBe(v);
  });
  it('rounds up, never down', () => {
    expect(nextE12AtLeast(151)).toBe(180);
    expect(nextE12AtLeast(350)).toBe(390);
    expect(nextE12AtLeast(4701)).toBe(5600);
  });
  it('crosses decades', () => {
    expect(nextE12AtLeast(83)).toBe(100);
    expect(nextE12AtLeast(9500)).toBe(10000);
    expect(nextE12AtLeast(0.5)).toBe(0.56);
    expect(nextE12AtLeast(0.09)).toBe(0.1);
  });
  it('tolerates floating-point noise just above a standard value', () => {
    expect(nextE12AtLeast(150.00000000001)).toBe(150);
  });
  it('rejects values that make no sense', () => {
    for (const v of [0, -1, NaN, Infinity]) {
      let threw = false;
      try { nextE12AtLeast(v); } catch { threw = true; }
      expect(threw).toBe(true);
    }
  });
});
