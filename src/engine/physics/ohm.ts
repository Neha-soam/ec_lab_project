import { formatNumber as n } from '../units/format';
import { BASE_UNIT } from '../units/units';
import { buildResult, conversionLines, readInputs, type CalcOutcome, type RawInput } from './common';
import type { SymbolKey } from './quantities';

export type OhmTarget = 'V' | 'I' | 'R';

export const OHM_TARGETS: readonly OhmTarget[] = ['V', 'I', 'R'];

const FORMULA: Record<OhmTarget, string> = {
  V: 'V = I \u00D7 R',
  I: 'I = V / R',
  R: 'R = V / I',
};

const VOLT = BASE_UNIT.voltage;
const AMP = BASE_UNIT.current;
const OHM = BASE_UNIT.resistance;

/** R is never zero (division, and a 0 Ω resistor is a short circuit). I is only a divisor when solving for R. */
function ruleFor(symbol: OhmTarget, target: OhmTarget) {
  if (symbol === 'R') return 'positive' as const;
  if (symbol === 'I' && target === 'R') return 'positive' as const;
  return 'nonNegative' as const;
}

export function solveOhm(target: OhmTarget, inputs: Partial<Record<string, RawInput>>): CalcOutcome {
  const needed = OHM_TARGETS.filter((s) => s !== target);
  const read = readInputs(
    needed.map((symbol) => ({ symbol: symbol as SymbolKey, rule: ruleFor(symbol, target) })),
    inputs,
  );
  if (!read.ok) return { ok: false, errors: read.errors };

  const { V, I, R } = read.values;
  const conversions = conversionLines(read.values);
  const formula = FORMULA[target];

  switch (target) {
    case 'V': {
      const value = I.base * R.base;
      return buildResult('V', 'voltage', value, {
        formula,
        conversions,
        substitution: `V = ${n(I.base)} ${AMP} \u00D7 ${n(R.base)} ${OHM}`,
        calculation: `${n(I.base)} \u00D7 ${n(R.base)} = ${n(value)}`,
      });
    }
    case 'I': {
      const value = V.base / R.base;
      return buildResult('I', 'current', value, {
        formula,
        conversions,
        substitution: `I = ${n(V.base)} ${VOLT} / ${n(R.base)} ${OHM}`,
        calculation: `${n(V.base)} / ${n(R.base)} = ${n(value)}`,
      });
    }
    case 'R': {
      const value = V.base / I.base;
      return buildResult('R', 'resistance', value, {
        formula,
        conversions,
        substitution: `R = ${n(V.base)} ${VOLT} / ${n(I.base)} ${AMP}`,
        calculation: `${n(V.base)} / ${n(I.base)} = ${n(value)}`,
      });
    }
  }
}
