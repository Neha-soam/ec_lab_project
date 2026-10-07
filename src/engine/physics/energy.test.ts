import { describe, it, expect } from 'vitest';
import { solveEnergy } from './energy';

describe('solveEnergy', () => {
  it('E = P \u00D7 t: 100 W for 2 h = 720000 J = 200 Wh = 0.2 kWh', () => {
    const r = solveEnergy({ P: { raw: '100', unit: 'W' }, t: { raw: '2', unit: 'h' } });
    expect(r.ok && r.result.result.baseValue).toBe(720000);
    expect(r.ok && r.result.result.text).toBe('E = 720000 J');
    expect(r.ok && r.result.result.ranged).toBe('720 kJ');
    expect(r.ok && r.result.equivalents).toEqual(['200 Wh', '0.2 kWh']);
    expect(r.ok && r.result.conversions).toEqual(['t = 2 h = 7200 s']);
  });

  it('converts mW and ms', () => {
    const r = solveEnergy({ P: { raw: '500', unit: 'mW' }, t: { raw: '200', unit: 'ms' } });
    expect(r.ok && r.result.result.baseValue).toBe(0.1);
  });

  it('allows zero time', () => {
    const r = solveEnergy({ P: { raw: '10', unit: 'W' }, t: { raw: '0', unit: 's' } });
    expect(r.ok && r.result.result.baseValue).toBe(0);
  });

  it('rejects empty and invalid input', () => {
    const r = solveEnergy({ P: { raw: '', unit: 'W' }, t: { raw: 'x', unit: 's' } });
    expect(r.ok ? {} : r.errors).toEqual({
      P: 'Enter a value for P.',
      t: 't must be a number, for example 12 or 0.5.',
    });
  });
});
