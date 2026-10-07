import { formatNumber as n } from '../units/format';
import { BASE_UNIT } from '../units/units';
import { buildResult, conversionLines, readInputs, type CalcOutcome, type CalcResult, type RawInput } from './common';

export type PowerMode = 'VI' | 'I2R' | 'V2R';

export const POWER_MODES: Record<PowerMode, { formula: string; inputs: readonly ('V' | 'I' | 'R')[] }> = {
  VI: { formula: 'P = V \u00D7 I', inputs: ['V', 'I'] },
  I2R: { formula: 'P = I\u00B2 \u00D7 R', inputs: ['I', 'R'] },
  V2R: { formula: 'P = V\u00B2 / R', inputs: ['V', 'R'] },
};

/** Common resistor power ratings in watts, for the wattage check. */
export const STANDARD_RATINGS_W: readonly { watts: number; label: string }[] = [
  { watts: 0.125, label: '\u215B W' },
  { watts: 0.25, label: '\u00BC W' },
  { watts: 0.5, label: '\u00BD W' },
  { watts: 1, label: '1 W' },
  { watts: 2, label: '2 W' },
  { watts: 5, label: '5 W' },
];

export interface RatingCheck {
  ratingW: number;
  exceeds: boolean;
  /** Dissipated power as a percentage of the rating. */
  percentOfRating: number;
  message: string;
}

export function checkResistorRating(powerW: number, ratingW: number): RatingCheck {
  const percentOfRating = (powerW / ratingW) * 100;
  const exceeds = powerW > ratingW;
  const message = exceeds
    ? `Warning: ${n(powerW)} W exceeds the ${n(ratingW)} W rating of this resistor. It could overheat and fail. Choose a higher-rated resistor or reduce the voltage or current.`
    : `Within the ${n(ratingW)} W rating (${n(percentOfRating)}% of the rating). Real designs usually leave some margin.`;
  return { ratingW, exceeds, percentOfRating, message };
}

export type PowerOutcome =
  | { ok: true; result: CalcResult; rating?: RatingCheck }
  | Extract<CalcOutcome, { ok: false }>;

export function solvePower(
  mode: PowerMode,
  inputs: Partial<Record<string, RawInput>>,
  ratingW?: number | null,
): PowerOutcome {
  const { formula, inputs: symbols } = POWER_MODES[mode];
  const read = readInputs(
    symbols.map((symbol) => ({ symbol, rule: symbol === 'R' ? ('positive' as const) : ('nonNegative' as const) })),
    inputs,
  );
  if (!read.ok) return { ok: false, errors: read.errors };

  const { V, I, R } = read.values;
  const conversions = conversionLines(read.values);
  const VOLT = BASE_UNIT.voltage;
  const AMP = BASE_UNIT.current;
  const OHM = BASE_UNIT.resistance;

  let power: number;
  let substitution: string;
  let calculation: string;
  if (mode === 'VI') {
    power = V.base * I.base;
    substitution = `P = ${n(V.base)} ${VOLT} \u00D7 ${n(I.base)} ${AMP}`;
    calculation = `${n(V.base)} \u00D7 ${n(I.base)} = ${n(power)}`;
  } else if (mode === 'I2R') {
    power = I.base * I.base * R.base;
    substitution = `P = (${n(I.base)} ${AMP})\u00B2 \u00D7 ${n(R.base)} ${OHM}`;
    calculation = `${n(I.base)}\u00B2 \u00D7 ${n(R.base)} = ${n(power)}`;
  } else {
    power = (V.base * V.base) / R.base;
    substitution = `P = (${n(V.base)} ${VOLT})\u00B2 / ${n(R.base)} ${OHM}`;
    calculation = `${n(V.base)}\u00B2 / ${n(R.base)} = ${n(power)}`;
  }

  const outcome = buildResult('P', 'power', power, { formula, conversions, substitution, calculation });
  if (!outcome.ok) return outcome;

  const hasRating = typeof ratingW === 'number' && Number.isFinite(ratingW) && ratingW > 0;
  return {
    ok: true,
    result: outcome.result,
    rating: hasRating ? checkResistorRating(power, ratingW) : undefined,
  };
}
