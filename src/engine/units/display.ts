import { formatNumber } from './format';
import { fromBase, pickBestUnit, type QuantityKind } from './units';

/** Formats a base-unit value in the most readable unit, e.g. (4700, 'resistance') -> '4.7 kΩ'. */
export function formatQuantity(baseValue: number, kind: QuantityKind): string {
  const unit = pickBestUnit(baseValue, kind);
  return `${formatNumber(fromBase(baseValue, unit))} ${unit.symbol}`;
}
