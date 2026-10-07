import type { QuantityKind } from '../units/units';

export type SymbolKey = 'V' | 'I' | 'R' | 'P' | 't';

export const QUANTITY_INFO: Record<SymbolKey, { name: string; kind: QuantityKind }> = {
  V: { name: 'Voltage', kind: 'voltage' },
  I: { name: 'Current', kind: 'current' },
  R: { name: 'Resistance', kind: 'resistance' },
  P: { name: 'Power', kind: 'power' },
  t: { name: 'Time', kind: 'time' },
};
