export type QuantityKind = 'voltage' | 'current' | 'resistance' | 'power' | 'energy' | 'time';

export interface UnitDef {
  symbol: string;
  name: string;
  kind: QuantityKind;
  /** value in this unit × factor = value in the SI base unit of the same kind. */
  factor: number;
  /** Whether results may be automatically shown in this unit. */
  autoRange: boolean;
}

const MU = '\u03BC';
const OHM = '\u03A9';

/** Rounding applied to conversions so 3 mA gives 0.003 A, not 0.0030000000000000005 A. */
const CONVERSION_PRECISION = 12;

export const UNITS: readonly UnitDef[] = [
  { symbol: 'mV', name: 'millivolt', kind: 'voltage', factor: 1e-3, autoRange: true },
  { symbol: 'V', name: 'volt', kind: 'voltage', factor: 1, autoRange: true },
  { symbol: 'kV', name: 'kilovolt', kind: 'voltage', factor: 1e3, autoRange: true },

  { symbol: `${MU}A`, name: 'microampere', kind: 'current', factor: 1e-6, autoRange: true },
  { symbol: 'mA', name: 'milliampere', kind: 'current', factor: 1e-3, autoRange: true },
  { symbol: 'A', name: 'ampere', kind: 'current', factor: 1, autoRange: true },

  { symbol: OHM, name: 'ohm', kind: 'resistance', factor: 1, autoRange: true },
  { symbol: `k${OHM}`, name: 'kilohm', kind: 'resistance', factor: 1e3, autoRange: true },
  { symbol: `M${OHM}`, name: 'megohm', kind: 'resistance', factor: 1e6, autoRange: true },

  { symbol: 'mW', name: 'milliwatt', kind: 'power', factor: 1e-3, autoRange: true },
  { symbol: 'W', name: 'watt', kind: 'power', factor: 1, autoRange: true },
  { symbol: 'kW', name: 'kilowatt', kind: 'power', factor: 1e3, autoRange: true },

  { symbol: 'mJ', name: 'millijoule', kind: 'energy', factor: 1e-3, autoRange: true },
  { symbol: 'J', name: 'joule', kind: 'energy', factor: 1, autoRange: true },
  { symbol: 'kJ', name: 'kilojoule', kind: 'energy', factor: 1e3, autoRange: true },
  { symbol: 'Wh', name: 'watt-hour', kind: 'energy', factor: 3600, autoRange: false },
  { symbol: 'kWh', name: 'kilowatt-hour', kind: 'energy', factor: 3.6e6, autoRange: false },

  { symbol: 'ms', name: 'millisecond', kind: 'time', factor: 1e-3, autoRange: false },
  { symbol: 's', name: 'second', kind: 'time', factor: 1, autoRange: false },
  { symbol: 'min', name: 'minute', kind: 'time', factor: 60, autoRange: false },
  { symbol: 'h', name: 'hour', kind: 'time', factor: 3600, autoRange: false },
];

export const BASE_UNIT: Record<QuantityKind, string> = {
  voltage: 'V',
  current: 'A',
  resistance: OHM,
  power: 'W',
  energy: 'J',
  time: 's',
};

export function unitsFor(kind: QuantityKind): UnitDef[] {
  return UNITS.filter((u) => u.kind === kind);
}

export function findUnit(kind: QuantityKind, symbol: string): UnitDef | undefined {
  return UNITS.find((u) => u.kind === kind && u.symbol === symbol);
}

export function baseUnitOf(kind: QuantityKind): UnitDef {
  return unitsFor(kind).find((u) => u.factor === 1 && u.symbol === BASE_UNIT[kind])!;
}

/** Rounds away binary floating-point noise (0.30000000000000004 -> 0.3). */
export function cleanFloat(x: number): number {
  return Number(x.toPrecision(CONVERSION_PRECISION));
}

export function toBase(value: number, unit: UnitDef): number {
  return cleanFloat(value * unit.factor);
}

export function fromBase(baseValue: number, unit: UnitDef): number {
  return cleanFloat(baseValue / unit.factor);
}

export function convert(value: number, from: UnitDef, to: UnitDef): number {
  return fromBase(toBase(value, from), to);
}

/** Chooses the largest auto-range unit that keeps the number at 1 or more (e.g. 0.002 A -> mA). */
export function pickBestUnit(baseValue: number, kind: QuantityKind): UnitDef {
  const candidates = unitsFor(kind)
    .filter((u) => u.autoRange)
    .sort((a, b) => b.factor - a.factor);
  if (candidates.length === 0 || baseValue === 0) return baseUnitOf(kind);
  const abs = Math.abs(baseValue);
  return candidates.find((u) => abs >= u.factor) ?? candidates[candidates.length - 1];
}
