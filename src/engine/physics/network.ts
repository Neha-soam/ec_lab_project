import { formatNumber as n } from '../units/format';
import { BASE_UNIT } from '../units/units';
import { buildResult, conversionLines, readInputs, type CalcOutcome, type RawInput, type ReadValue } from './common';

export const MIN_RESISTORS = 2;
export const MAX_RESISTORS = 10;

const OHM = BASE_UNIT.resistance;

type Resistors = { ok: true; names: string[]; list: ReadValue[]; conversions: string[] } | { ok: false; errors: Record<string, string> };

/** Reads R1..Rn. Resistances must be above zero: 0 \u03A9 is a short circuit. */
function readResistors(inputs: readonly RawInput[]): Resistors {
  if (inputs.length < MIN_RESISTORS) return { ok: false, errors: { result: `Enter at least ${MIN_RESISTORS} resistors.` } };
  if (inputs.length > MAX_RESISTORS) return { ok: false, errors: { result: `This tool supports up to ${MAX_RESISTORS} resistors.` } };

  const names = inputs.map((_, i) => `R${i + 1}`);
  const byName: Record<string, RawInput> = {};
  names.forEach((name, i) => (byName[name] = inputs[i]));

  const read = readInputs(names.map((symbol) => ({ symbol, quantity: 'R' as const, rule: 'positive' as const })), byName);
  if (!read.ok) return read;
  return { ok: true, names, list: names.map((name) => read.values[name]), conversions: conversionLines(read.values) };
}

export function solveSeries(inputs: readonly RawInput[]): CalcOutcome {
  const r = readResistors(inputs);
  if (!r.ok) return { ok: false, errors: r.errors };
  const bases = r.list.map((v) => v.base);
  const total = bases.reduce((sum, x) => sum + x, 0);
  return buildResult('Req', 'resistance', total, {
    formula: `Req = ${r.names.join(' + ')}`,
    conversions: r.conversions,
    substitution: `Req = ${bases.map((x) => `${n(x)} ${OHM}`).join(' + ')}`,
    calculation: `${bases.map((x) => n(x)).join(' + ')} = ${n(total)}`,
    notes: ['In a series circuit the equivalent resistance is larger than any single resistor.'],
  });
}

export function solveParallel(inputs: readonly RawInput[]): CalcOutcome {
  const r = readResistors(inputs);
  if (!r.ok) return { ok: false, errors: r.errors };
  const bases = r.list.map((v) => v.base);
  const reciprocals = bases.map((x) => 1 / x);
  const sum = reciprocals.reduce((s, x) => s + x, 0);
  const valid = Number.isFinite(sum) && sum > 0;
  const total = valid ? 1 / sum : NaN;

  return buildResult('Req', 'resistance', total, {
    formula: `1/Req = ${r.names.map((name) => `1/${name}`).join(' + ')}`,
    conversions: r.conversions,
    substitution: `1/Req = ${bases.map((x) => `1/${n(x)} ${OHM}`).join(' + ')}`,
    steps: [
      ...bases.map((x, i) => `1/${n(x)} = ${n(reciprocals[i])}`),
      `1/Req = ${reciprocals.map((x) => n(x)).join(' + ')} = ${n(sum)}`,
    ],
    calculation: `Req = 1 / ${n(sum)} = ${n(total)}`,
    notes: ['In a parallel circuit the equivalent resistance is smaller than the smallest resistor.'],
  });
}
