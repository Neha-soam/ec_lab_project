import { describe, it, expect } from 'vitest';
import { MAX_RESISTORS, solveParallel, solveSeries } from './network';

const OHM = '\u03A9';
const r = (raw: string, unit = OHM) => ({ raw, unit });

describe('solveSeries', () => {
  it('100 + 200 = 300 \u03A9', () => {
    const o = solveSeries([r('100'), r('200')]);
    expect(o.ok && o.result.result.baseValue).toBe(300);
    expect(o.ok && o.result.formula).toBe('Req = R1 + R2');
    expect(o.ok && o.result.substitution).toBe(`Req = 100 ${OHM} + 200 ${OHM}`);
    expect(o.ok && o.result.calculation).toBe('100 + 200 = 300');
    expect(o.ok && o.result.result.text).toBe(`Req = 300 ${OHM}`);
  });
  it('handles many resistors and mixed units, showing conversions', () => {
    const o = solveSeries([r('1', `k${OHM}`), r('470'), r('2.2', `k${OHM}`)]);
    expect(o.ok && o.result.result.baseValue).toBe(3670);
    expect(o.ok && o.result.result.ranged).toBe(`3.67 k${OHM}`);
    expect(o.ok && o.result.conversions).toEqual([`R1 = 1 k${OHM} = 1000 ${OHM}`, `R3 = 2.2 k${OHM} = 2200 ${OHM}`]);
    expect(o.ok && o.result.formula).toBe('Req = R1 + R2 + R3');
  });
  it('is larger than any single resistor', () => {
    const o = solveSeries([r('10'), r('5')]);
    expect(o.ok && o.result.result.baseValue > 10).toBe(true);
  });
});

describe('solveParallel', () => {
  it('100 \u2016 200 = 66.6667 \u03A9, with the reciprocal working shown', () => {
    const o = solveParallel([r('100'), r('200')]);
    expect(o.ok && o.result.result.text).toBe(`Req = 66.6667 ${OHM}`);
    expect(o.ok && o.result.formula).toBe('1/Req = 1/R1 + 1/R2');
    expect(o.ok && o.result.steps).toEqual(['1/100 = 0.01', '1/200 = 0.005', '1/Req = 0.01 + 0.005 = 0.015']);
    expect(o.ok && o.result.calculation).toBe('Req = 1 / 0.015 = 66.6667');
  });
  it('three equal 100 \u03A9 resistors give 33.3333 \u03A9', () => {
    const o = solveParallel([r('100'), r('100'), r('100')]);
    expect(o.ok && Math.round((o.result.result.baseValue as number) * 1e4) / 1e4).toBe(33.3333);
  });
  it('two equal resistors give half', () => {
    const o = solveParallel([r('1', `k${OHM}`), r('1000')]);
    expect(o.ok && o.result.result.baseValue).toBe(500);
  });
  it('is smaller than the smallest resistor', () => {
    const o = solveParallel([r('47'), r('1', `M${OHM}`)]);
    expect(o.ok && o.result.result.baseValue < 47).toBe(true);
  });
});

describe('resistor list validation', () => {
  it('needs at least two resistors', () => {
    for (const solve of [solveSeries, solveParallel]) {
      const o = solve([r('100')]);
      expect(o.ok ? '' : o.errors.result).toBe('Enter at least 2 resistors.');
      expect(solve([]).ok).toBe(false);
    }
  });
  it(`allows at most ${MAX_RESISTORS}`, () => {
    const many = Array.from({ length: MAX_RESISTORS + 1 }, () => r('100'));
    const o = solveSeries(many);
    expect(o.ok ? '' : o.errors.result).toBe(`This tool supports up to ${MAX_RESISTORS} resistors.`);
    expect(solveSeries(many.slice(0, MAX_RESISTORS)).ok).toBe(true);
  });
  it('reports every bad row by name', () => {
    const o = solveParallel([r(''), r('abc'), r('0'), r('-5'), r('100')]);
    expect(o.ok ? {} : o.errors).toEqual({
      R1: 'Enter a value for R1.',
      R2: 'R2 must be a number, for example 12 or 0.5.',
      R3: 'R3 must be greater than zero.',
      R4: 'R4 cannot be negative. This calculator works with magnitudes.',
    });
  });
  it('rejects 0 \u03A9 (a short circuit) in parallel, which would divide by zero', () => {
    expect(solveParallel([r('0'), r('100')]).ok).toBe(false);
  });
  it('reports overflow instead of returning Infinity', () => {
    const o = solveSeries([r('1e308'), r('1e308')]);
    expect(o.ok ? '' : o.errors.result).toBe('The result is too large to calculate. Check the values and units you entered.');
  });
});
