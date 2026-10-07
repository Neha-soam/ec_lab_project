import { formatNumber as n } from '../units/format';
import { BASE_UNIT, findUnit, fromBase } from '../units/units';
import { buildResult, conversionLines, readInputs, type CalcOutcome, type RawInput } from './common';

const WATT = BASE_UNIT.power;
const SECOND = BASE_UNIT.time;

/** E = P × t. Time may be 0 (no energy transferred). */
export function solveEnergy(inputs: Partial<Record<string, RawInput>>): CalcOutcome {
  const read = readInputs(
    [
      { symbol: 'P', rule: 'nonNegative' },
      { symbol: 't', rule: 'nonNegative' },
    ],
    inputs,
  );
  if (!read.ok) return { ok: false, errors: read.errors };

  const { P, t } = read.values;
  const energy = P.base * t.base;
  const outcome = buildResult('E', 'energy', energy, {
    formula: 'E = P \u00D7 t',
    conversions: conversionLines(read.values),
    substitution: `E = ${n(P.base)} ${WATT} \u00D7 ${n(t.base)} ${SECOND}`,
    calculation: `${n(P.base)} \u00D7 ${n(t.base)} = ${n(energy)}`,
  });
  if (!outcome.ok) return outcome;

  const wh = findUnit('energy', 'Wh')!;
  const kwh = findUnit('energy', 'kWh')!;
  return {
    ok: true,
    result: {
      ...outcome.result,
      equivalents: [`${n(fromBase(energy, wh))} Wh`, `${n(fromBase(energy, kwh))} kWh`],
    },
  };
}
