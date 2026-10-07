import { describe, it, expect } from 'vitest';
import { convert, findUnit, fromBase, pickBestUnit, toBase, unitsFor, UNITS } from './units';
import { formatNumber } from './format';

const unit = (kind: Parameters<typeof findUnit>[0], symbol: string) => findUnit(kind, symbol)!;

describe('unit conversion', () => {
  it('converts prefixed units to base units', () => {
    expect(toBase(2, unit('current', 'mA'))).toBe(0.002);
    expect(toBase(470, unit('current', '\u03BCA'))).toBe(0.00047);
    expect(toBase(5, unit('resistance', 'k\u03A9'))).toBe(5000);
    expect(toBase(2.2, unit('resistance', 'M\u03A9'))).toBe(2200000);
    expect(toBase(1.5, unit('voltage', 'kV'))).toBe(1500);
    expect(toBase(250, unit('voltage', 'mV'))).toBe(0.25);
  });

  it('avoids floating-point noise', () => {
    expect(toBase(3, unit('current', 'mA'))).toBe(0.003);
    expect(toBase(7, unit('current', 'mA'))).toBe(0.007);
  });

  it('converts between units and back', () => {
    expect(convert(5, unit('current', 'mA'), unit('current', 'A'))).toBe(0.005);
    expect(convert(1, unit('voltage', 'kV'), unit('voltage', 'mV'))).toBe(1000000);
    expect(fromBase(0.002, unit('current', 'mA'))).toBe(2);
  });

  it('handles energy and time units', () => {
    expect(toBase(1, unit('energy', 'kWh'))).toBe(3600000);
    expect(toBase(2, unit('time', 'h'))).toBe(7200);
    expect(toBase(90, unit('time', 'min'))).toBe(5400);
  });

  it('has the units the spec requires and no duplicate symbols per kind', () => {
    const required = [
      ['voltage', ['V', 'mV', 'kV']],
      ['current', ['A', 'mA', '\u03BCA']],
      ['resistance', ['\u03A9', 'k\u03A9', 'M\u03A9']],
    ] as const;
    for (const [kind, symbols] of required) {
      for (const s of symbols) expect(findUnit(kind, s) === undefined).toBe(false);
    }
    const keys = UNITS.map((u) => `${u.kind}:${u.symbol}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(unitsFor('voltage').length).toBe(3);
    expect(findUnit('voltage', 'mA')).toBeUndefined();
  });

  it('picks a readable unit for results', () => {
    expect(pickBestUnit(0.002, 'current').symbol).toBe('mA');
    expect(pickBestUnit(5000, 'resistance').symbol).toBe('k\u03A9');
    expect(pickBestUnit(10, 'voltage').symbol).toBe('V');
    expect(pickBestUnit(0, 'current').symbol).toBe('A');
    expect(pickBestUnit(3e-9, 'current').symbol).toBe('\u03BCA');
    expect(pickBestUnit(7200, 'time').symbol).toBe('s');
  });
});

describe('formatNumber', () => {
  it('rounds away floating-point noise', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(1234.5678912)).toBe('1234.57');
  });
  it('handles zero, negatives and extremes', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(-2.5)).toBe('-2.5');
    expect(formatNumber(1e-7)).toBe('1e-7');
    expect(formatNumber(1e20)).toBe('1e+20');
    expect(formatNumber(720000)).toBe('720000');
  });
});
