import { describe, it, expect } from 'vitest';
import { solveOhm } from './ohm';

const OHM = '\u03A9';
const KOHM = 'k\u03A9';

function ok(outcome: ReturnType<typeof solveOhm>) {
  if (!outcome.ok) throw new Error('expected success: ' + JSON.stringify(outcome.errors));
  return outcome.result;
}

describe('solveOhm', () => {
  it('10 V / 2 \u03A9 = 5 A', () => {
    const r = ok(solveOhm('I', { V: { raw: '10', unit: 'V' }, R: { raw: '2', unit: OHM } }));
    expect(r.result.baseValue).toBe(5);
    expect(r.result.text).toBe('I = 5 A');
    expect(r.formula).toBe('I = V / R');
  });

  it('12 V / 100 \u03A9 = 0.12 A (shown as 120 mA)', () => {
    const r = ok(solveOhm('I', { V: { raw: '12', unit: 'V' }, R: { raw: '100', unit: OHM } }));
    expect(r.result.baseValue).toBe(0.12);
    expect(r.result.ranged).toBe('120 mA');
  });

  it('spec example: 2 mA \u00D7 5 k\u03A9 = 10 V, with visible unit conversions', () => {
    const r = ok(solveOhm('V', { I: { raw: '2', unit: 'mA' }, R: { raw: '5', unit: KOHM } }));
    expect(r.formula).toBe('V = I \u00D7 R');
    expect(r.conversions).toEqual(['I = 2 mA = 0.002 A', `R = 5 ${KOHM} = 5000 ${OHM}`]);
    expect(r.substitution).toBe(`V = 0.002 A \u00D7 5000 ${OHM}`);
    expect(r.calculation).toBe('0.002 \u00D7 5000 = 10');
    expect(r.result.text).toBe('V = 10 V');
    expect(r.result.unitName).toBe('volt');
    expect(r.result.ranged).toBeUndefined();
  });

  it('R = V / I', () => {
    const r = ok(solveOhm('R', { V: { raw: '12', unit: 'V' }, I: { raw: '20', unit: 'mA' } }));
    expect(r.result.baseValue).toBe(600);
    expect(r.result.text).toBe(`R = 600 ${OHM}`);
  });

  it('shows no conversion lines when inputs are already base units', () => {
    const r = ok(solveOhm('I', { V: { raw: '10', unit: 'V' }, R: { raw: '2', unit: OHM } }));
    expect(r.conversions).toEqual([]);
  });

  it('allows zero voltage or current when it is not a divisor', () => {
    expect(ok(solveOhm('I', { V: { raw: '0', unit: 'V' }, R: { raw: '10', unit: OHM } })).result.baseValue).toBe(0);
    expect(ok(solveOhm('V', { I: { raw: '0', unit: 'A' }, R: { raw: '10', unit: OHM } })).result.baseValue).toBe(0);
  });

  it('reports every empty field at once', () => {
    const r = solveOhm('V', { I: { raw: '', unit: 'A' }, R: { raw: '', unit: OHM } });
    expect(r.ok).toBe(false);
    expect(r.ok ? {} : r.errors).toEqual({ I: 'Enter a value for I.', R: 'Enter a value for R.' });
  });

  it('reports missing inputs', () => {
    const r = solveOhm('V', {});
    expect(r.ok ? [] : Object.keys(r.errors)).toEqual(['I', 'R']);
  });

  it('rejects zero resistance and zero current when dividing', () => {
    const a = solveOhm('I', { V: { raw: '5', unit: 'V' }, R: { raw: '0', unit: OHM } });
    expect(a.ok ? '' : a.errors.R).toBe('R must be greater than zero.');
    const b = solveOhm('R', { V: { raw: '5', unit: 'V' }, I: { raw: '0', unit: 'A' } });
    expect(b.ok ? '' : b.errors.I).toBe('I must be greater than zero.');
  });

  it('rejects invalid text, negatives and wrong units', () => {
    const a = solveOhm('V', { I: { raw: 'abc', unit: 'A' }, R: { raw: '-4', unit: OHM } });
    expect(a.ok ? [] : Object.keys(a.errors)).toEqual(['I', 'R']);
    const b = solveOhm('V', { I: { raw: '1', unit: 'V' }, R: { raw: '1', unit: OHM } });
    expect(b.ok ? '' : b.errors.I).toBe('Choose a valid unit for I.');
  });

  it('reports overflow instead of returning Infinity', () => {
    const r = solveOhm('V', { I: { raw: '1e200', unit: 'A' }, R: { raw: '1e200', unit: OHM } });
    expect(r.ok).toBe(false);
    expect(r.ok ? '' : r.errors.result).toBe('The result is too large to calculate. Check the values and units you entered.');
  });
});
