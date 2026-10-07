import { describe, it, expect } from 'vitest';
import { checkResistorRating, solvePower } from './power';

const OHM = '\u03A9';

describe('solvePower', () => {
  it('P = V \u00D7 I: 12 V \u00D7 0.5 A = 6 W', () => {
    const r = solvePower('VI', { V: { raw: '12', unit: 'V' }, I: { raw: '0.5', unit: 'A' } });
    expect(r.ok && r.result.result.baseValue).toBe(6);
    expect(r.ok && r.result.formula).toBe('P = V \u00D7 I');
  });

  it('P = I\u00B2R: 2 A, 5 \u03A9 = 20 W', () => {
    const r = solvePower('I2R', { I: { raw: '2', unit: 'A' }, R: { raw: '5', unit: OHM } });
    expect(r.ok && r.result.result.baseValue).toBe(20);
    expect(r.ok && r.result.substitution).toBe(`P = (2 A)\u00B2 \u00D7 5 ${OHM}`);
  });

  it('P = V\u00B2/R: 10 V, 100 \u03A9 = 1 W', () => {
    const r = solvePower('V2R', { V: { raw: '10', unit: 'V' }, R: { raw: '100', unit: OHM } });
    expect(r.ok && r.result.result.baseValue).toBe(1);
  });

  it('shows unit conversions and ranges small results', () => {
    const r = solvePower('VI', { V: { raw: '5', unit: 'V' }, I: { raw: '20', unit: 'mA' } });
    expect(r.ok && r.result.conversions).toEqual(['I = 20 mA = 0.02 A']);
    expect(r.ok && r.result.result.ranged).toBe('100 mW');
  });

  it('only asks for the inputs the chosen formula needs', () => {
    const r = solvePower('VI', {});
    expect(r.ok ? [] : Object.keys(r.errors)).toEqual(['V', 'I']);
  });

  it('rejects empty, invalid and zero resistance', () => {
    const a = solvePower('V2R', { V: { raw: '', unit: 'V' }, R: { raw: '0', unit: OHM } });
    expect(a.ok ? {} : a.errors).toEqual({ V: 'Enter a value for V.', R: 'R must be greater than zero.' });
  });
});

describe('resistor wattage check', () => {
  it('warns when power exceeds the rating', () => {
    const c = checkResistorRating(0.5, 0.25);
    expect(c.exceeds).toBe(true);
    expect(c.percentOfRating).toBe(200);
    expect(c.message.startsWith('Warning:')).toBe(true);
  });

  it('does not warn at exactly the rating (boundary)', () => {
    expect(checkResistorRating(0.25, 0.25).exceeds).toBe(false);
    expect(checkResistorRating(0.2500001, 0.25).exceeds).toBe(true);
  });

  it('is included in solvePower only when a valid rating is given', () => {
    const inputs = { V: { raw: '10', unit: 'V' }, R: { raw: '100', unit: OHM } };
    const withRating = solvePower('V2R', inputs, 0.25);
    expect(withRating.ok && withRating.rating?.exceeds).toBe(true);
    const omitted = solvePower('V2R', inputs);
    expect(omitted.ok && omitted.rating === undefined).toBe(true);
    const none = solvePower('V2R', inputs, null);
    expect(none.ok && none.rating === undefined).toBe(true);
    const bad = solvePower('V2R', inputs, 0);
    expect(bad.ok && bad.rating === undefined).toBe(true);
  });
});
