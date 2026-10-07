import { describe, it, expect } from 'vitest';
import { MAX_SUPPLY_V, solveLed } from './led';

const OHM = '\u03A9';
const led = (vs: string, vf: string, i: string, iUnit = 'mA') =>
  solveLed({ Vs: { raw: vs, unit: 'V' }, Vf: { raw: vf, unit: 'V' }, I: { raw: i, unit: iUnit } });

describe('solveLed', () => {
  it('5 V supply, 2 V LED, 20 mA gives 150 \u03A9 (a standard value)', () => {
    const o = led('5', '2', '20');
    expect(o.ok && o.result.result.text).toBe(`R = 150 ${OHM}`);
    expect(o.ok && o.result.formula).toBe('R = (Vs \u2212 Vf) / I');
    expect(o.ok && o.result.conversions).toEqual(['I = 20 mA = 0.02 A']);
    expect(o.ok && o.result.steps).toEqual(['Voltage across the resistor: Vs \u2212 Vf = 5 \u2212 2 = 3 V']);
    expect(o.ok && o.result.related?.[0]).toBe('Resistor power: P = (Vs \u2212 Vf) \u00D7 I = 3 \u00D7 0.02 = 60 mW');
    expect(o.ok && o.result.related?.[1]).toBe(`150 ${OHM} is a standard E12 value.`);
    expect(o.ok && o.result.related?.[2]).toBe('Smallest standard power rating that is not exceeded: \u215B W.');
  });
  it('9 V supply gives 350 \u03A9, so the next standard value is 390 \u03A9 (about 17.9 mA)', () => {
    const o = led('9', '2', '20');
    expect(o.ok && o.result.result.baseValue).toBe(350);
    expect(o.ok && o.result.related?.[1]).toBe(`Nearest standard E12 value (not below the result): 390 ${OHM}, giving about 17.9487 mA.`);
  });
  it('avoids floating-point noise in Vs \u2212 Vf (9 \u2212 2.1)', () => {
    const o = led('9', '2.1', '10');
    expect(o.ok && o.result.result.baseValue).toBe(690);
  });
  it('recommends a larger power rating when needed', () => {
    const o = led('24', '2', '150');   // 22 V x 0.15 A = 3.3 W
    expect(o.ok && o.result.related?.[2]).toBe('Smallest standard power rating that is not exceeded: 5 W.');
    const big = led('30', '1', '1000');
    expect(big.ok && big.result.related?.[2]).toBe('The power is above 5 W: choose a resistor with a higher rating.');
  });
  it('warns about currents above the typical LED limit', () => {
    const high = led('5', '2', '30');
    expect(high.ok && high.result.notes?.[0]).toContain('above about 20 mA');
    const ok = led('5', '2', '20');
    expect(ok.ok && ok.result.notes?.length).toBe(1);
  });
  it('always notes that Vf comes from the datasheet', () => {
    const o = led('5', '2', '20');
    expect(o.ok && o.result.notes?.[0]).toContain('datasheet');
  });
});

describe('solveLed validation', () => {
  it('requires Vs to be greater than Vf', () => {
    const msg = 'The supply voltage (Vs) must be greater than the LED forward voltage (Vf), or no current can flow.';
    for (const [vs, vf] of [['2', '2'], ['1.5', '2']]) {
      const o = led(vs, vf, '20');
      expect(o.ok ? '' : o.errors.Vs).toBe(msg);
    }
  });
  it(`limits the supply to ${MAX_SUPPLY_V} V (low-voltage tool) and accepts exactly that`, () => {
    const over = led('30.1', '2', '20');
    expect(over.ok ? '' : over.errors.Vs).toBe('This tool is for low-voltage educational circuits (up to 30 V).');
    expect(led('30', '2', '20').ok).toBe(true);
    const kv = solveLed({ Vs: { raw: '1', unit: 'kV' }, Vf: { raw: '2', unit: 'V' }, I: { raw: '20', unit: 'mA' } });
    expect(kv.ok).toBe(false);
  });
  it('rejects zero current (division by zero), empty and invalid input', () => {
    expect((led('5', '2', '0').ok ? '' : (led('5', '2', '0') as { errors: Record<string, string> }).errors.I)).toBe('I must be greater than zero.');
    const bad = led('', 'abc', '');
    expect(bad.ok ? {} : bad.errors).toEqual({
      Vs: 'Enter a value for Vs.',
      Vf: 'Vf must be a number, for example 12 or 0.5.',
      I: 'Enter a value for I.',
    });
  });
});
