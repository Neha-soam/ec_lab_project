import { formatNumber } from '../units/format';
import {
  BASE_UNIT,
  baseUnitOf,
  findUnit,
  fromBase,
  pickBestUnit,
  toBase,
  type QuantityKind,
  type UnitDef,
} from '../units/units';
import { validateQuantity, type ValueRule } from '../validation/validate';
import { QUANTITY_INFO, type SymbolKey } from './quantities';

export interface RawInput {
  raw: string;
  unit: string;
}

export interface CalcResult {
  formula: string;
  /** One line per input that was not already in the base unit. Conversions are always shown. */
  conversions: string[];
  substitution: string;
  calculation: string;
  /** Intermediate working, shown before the final calculation (for example 1/R for each resistor). */
  steps?: string[];
  result: {
    symbol: string;
    baseValue: number;
    baseUnit: string;
    unitName: string;
    text: string;
    /** Same value in a friendlier unit, only when it differs from the base unit. */
    ranged?: string;
  };
  equivalents?: string[];
  /** Other values worked out alongside the main result. */
  related?: string[];
  /** Teaching points and cautions about the model or the numbers. */
  notes?: string[];
}

export type CalcOutcome =
  | { ok: true; result: CalcResult }
  | { ok: false; errors: Partial<Record<string, string>> };

export interface ReadValue {
  value: number;
  unit: UnitDef;
  base: number;
  conversion: string | null;
}

export interface InputSpec {
  /** Name shown to the user and used as the error key, for example 'R1' or 'Vin'. */
  symbol: string;
  /** What kind of quantity it is, when the name is not itself V, I, R, P or t. */
  quantity?: SymbolKey;
  rule: ValueRule;
}

export function readInputs(
  specs: InputSpec[],
  inputs: Partial<Record<string, RawInput>>,
): { ok: true; values: Record<string, ReadValue> } | { ok: false; errors: Record<string, string> } {
  const values: Record<string, ReadValue> = {};
  const errors: Record<string, string> = {};

  for (const { symbol, quantity, rule } of specs) {
    const { kind } = QUANTITY_INFO[quantity ?? (symbol as SymbolKey)];
    const input = inputs[symbol];
    if (!input) {
      errors[symbol] = `Enter a value for ${symbol}.`;
      continue;
    }
    const unit = findUnit(kind, input.unit);
    if (!unit) {
      errors[symbol] = `Choose a valid unit for ${symbol}.`;
      continue;
    }
    const parsed = validateQuantity(symbol, input.raw, rule);
    if (!parsed.ok) {
      errors[symbol] = parsed.error;
      continue;
    }
    const base = toBase(parsed.value, unit);
    const baseSymbol = BASE_UNIT[kind];
    values[symbol] = {
      value: parsed.value,
      unit,
      base,
      conversion:
        unit.factor === 1
          ? null
          : `${symbol} = ${formatNumber(parsed.value)} ${unit.symbol} = ${formatNumber(base)} ${baseSymbol}`,
    };
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, values };
}

export function conversionLines(values: Record<string, ReadValue>): string[] {
  return Object.values(values)
    .map((v) => v.conversion)
    .filter((line): line is string => line !== null);
}

export function buildResult(
  symbol: string,
  kind: QuantityKind,
  baseValue: number,
  parts: Pick<CalcResult, 'formula' | 'conversions' | 'substitution' | 'calculation'> &
    Partial<Pick<CalcResult, 'steps' | 'related' | 'notes'>>,
): CalcOutcome {
  if (!Number.isFinite(baseValue)) {
    return {
      ok: false,
      errors: { result: 'The result is too large to calculate. Check the values and units you entered.' },
    };
  }
  const base = baseUnitOf(kind);
  const best = pickBestUnit(baseValue, kind);
  const ranged =
    best.symbol !== base.symbol ? `${formatNumber(fromBase(baseValue, best))} ${best.symbol}` : undefined;
  return {
    ok: true,
    result: {
      ...parts,
      result: {
        symbol,
        baseValue,
        baseUnit: base.symbol,
        unitName: base.name,
        text: `${symbol} = ${formatNumber(baseValue)} ${base.symbol}`,
        ranged,
      },
    },
  };
}
