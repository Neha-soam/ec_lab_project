import { describe, it, expect } from 'vitest';
import { solveCurrentDivider, solveVoltageDivider } from './dividers';

const OHM = '\u03A9';
const k = `k${OHM}`;

describe('solveVoltageDivider', () => {
  it('12 V across 1 k\u03A9 + 2 k\u03A9 gives 8 V at the output', () => {
    const o = solveVoltageDivider({ Vin: { raw: '12', unit: 'V' }, R1: { raw: '1', unit: k }, R2: { raw: '2', unit: k } });
    expect(o.ok && o.result.result.baseValue).toBe(8);
    expect(o.ok && o.result.result.text).toBe('Vout = 8 V');
    expect(o.ok && o.result.formula).toBe('Vout = Vin \u00D7 R2 / (R1 + R2)');
    expect(o.ok && o.result.steps).toEqual([`R1 + R2 = 1000 + 2000 = 3000 ${OHM}`]);
    expect(o.ok && o.result.calculation).toBe('12 \u00D7 2000 / 3000 = 8');
    expect(o.ok && o.result.related).toEqual([
      'Current through both resistors: I = Vin / (R1 + R2) = 12 / 3000 = 4 mA',
      'Voltage across R1: Vin \u2212 Vout = 4 V',
    ]);
  });
  it('equal resistors halve the input', () => {
    const o = solveVoltageDivider({ Vin: { raw: '5', unit: 'V' }, R1: { raw: '10', unit: k }, R2: { raw: '10', unit: k } });
    expect(o.ok && o.result.result.baseValue).toBe(2.5);
  });
  it('states the no-load assumption', () => {
    const o = solveVoltageDivider({ Vin: { raw: '5', unit: 'V' }, R1: { raw: '1', unit: k }, R2: { raw: '1', unit: k } });
    expect(o.ok && o.result.notes?.[0]).toContain('nothing is connected across Vout');
  });
  it('allows 0 V input and gives 0 V', () => {
    const o = solveVoltageDivider({ Vin: { raw: '0', unit: 'V' }, R1: { raw: '1', unit: k }, R2: { raw: '1', unit: k } });
    expect(o.ok && o.result.result.baseValue).toBe(0);
  });
  it('reports empty, zero-resistance and invalid inputs together', () => {
    const o = solveVoltageDivider({ Vin: { raw: '', unit: 'V' }, R1: { raw: '0', unit: OHM }, R2: { raw: 'x', unit: OHM } });
    expect(o.ok ? {} : o.errors).toEqual({
      Vin: 'Enter a value for Vin.',
      R1: 'R1 must be greater than zero.',
      R2: 'R2 must be a number, for example 12 or 0.5.',
    });
  });
});

describe('solveCurrentDivider', () => {
  it('0.9 A into 100 \u03A9 and 200 \u03A9 splits 0.6 A / 0.3 A', () => {
    const o = solveCurrentDivider({ Iin: { raw: '0.9', unit: 'A' }, R1: { raw: '100', unit: OHM }, R2: { raw: '200', unit: OHM } });
    expect(o.ok && o.result.result.text).toBe('I1 = 0.6 A');
    expect(o.ok && o.result.related).toEqual([
      'Current through R2: I2 = Iin \u00D7 R1 / (R1 + R2) = 300 mA',
      'Check: I1 + I2 = 900 mA (equals Iin)',
    ]);
    expect(o.ok && o.result.notes).toEqual(['The smaller resistance carries the larger share of the current.']);
  });
  it('the smaller resistor gets the larger current', () => {
    const o = solveCurrentDivider({ Iin: { raw: '10', unit: 'mA' }, R1: { raw: '1', unit: k }, R2: { raw: '9', unit: k } });
    expect(o.ok && o.result.result.baseValue).toBe(0.009);
  });
  it('converts units and shows the conversion', () => {
    const o = solveCurrentDivider({ Iin: { raw: '10', unit: 'mA' }, R1: { raw: '1', unit: k }, R2: { raw: '1', unit: k } });
    expect(o.ok && o.result.conversions).toEqual(['Iin = 10 mA = 0.01 A', `R1 = 1 ${k} = 1000 ${OHM}`, `R2 = 1 ${k} = 1000 ${OHM}`]);
    expect(o.ok && o.result.result.baseValue).toBe(0.005);
  });
  it('rejects missing inputs', () => {
    const o = solveCurrentDivider({});
    expect(o.ok ? [] : Object.keys(o.errors)).toEqual(['Iin', 'R1', 'R2']);
  });
});
