import { formatNumber as n } from '../units/format';
import { BASE_UNIT } from '../units/units';
import { formatQuantity } from '../units/display';
import { buildResult, conversionLines, readInputs, type CalcOutcome, type RawInput } from './common';

const VOLT = BASE_UNIT.voltage;
const AMP = BASE_UNIT.current;
const OHM = BASE_UNIT.resistance;

/** Vout = Vin \u00D7 R2 / (R1 + R2): the output is taken across R2. */
export function solveVoltageDivider(inputs: Partial<Record<string, RawInput>>): CalcOutcome {
  const read = readInputs(
    [
      { symbol: 'Vin', quantity: 'V', rule: 'nonNegative' },
      { symbol: 'R1', quantity: 'R', rule: 'positive' },
      { symbol: 'R2', quantity: 'R', rule: 'positive' },
    ],
    inputs,
  );
  if (!read.ok) return { ok: false, errors: read.errors };

  const { Vin, R1, R2 } = read.values;
  const total = R1.base + R2.base;
  const vout = (Vin.base * R2.base) / total;
  const current = Vin.base / total;
  const vR1 = Vin.base - vout;

  return buildResult('Vout', 'voltage', vout, {
    formula: 'Vout = Vin \u00D7 R2 / (R1 + R2)',
    conversions: conversionLines(read.values),
    substitution: `Vout = ${n(Vin.base)} ${VOLT} \u00D7 ${n(R2.base)} ${OHM} / (${n(R1.base)} ${OHM} + ${n(R2.base)} ${OHM})`,
    steps: [`R1 + R2 = ${n(R1.base)} + ${n(R2.base)} = ${n(total)} ${OHM}`],
    calculation: `${n(Vin.base)} \u00D7 ${n(R2.base)} / ${n(total)} = ${n(vout)}`,
    related: [
      `Current through both resistors: I = Vin / (R1 + R2) = ${n(Vin.base)} / ${n(total)} = ${formatQuantity(current, 'current')}`,
      `Voltage across R1: Vin \u2212 Vout = ${formatQuantity(vR1, 'voltage')}`,
    ],
    notes: [
      'Simplified model: nothing is connected across Vout. A load in parallel with R2 lowers the output voltage.',
    ],
  });
}

/** Two parallel branches: I1 = Iin \u00D7 R2 / (R1 + R2) flows through R1, and I2 = Iin \u00D7 R1 / (R1 + R2) through R2. */
export function solveCurrentDivider(inputs: Partial<Record<string, RawInput>>): CalcOutcome {
  const read = readInputs(
    [
      { symbol: 'Iin', quantity: 'I', rule: 'nonNegative' },
      { symbol: 'R1', quantity: 'R', rule: 'positive' },
      { symbol: 'R2', quantity: 'R', rule: 'positive' },
    ],
    inputs,
  );
  if (!read.ok) return { ok: false, errors: read.errors };

  const { Iin, R1, R2 } = read.values;
  const total = R1.base + R2.base;
  const i1 = (Iin.base * R2.base) / total;
  const i2 = (Iin.base * R1.base) / total;

  return buildResult('I1', 'current', i1, {
    formula: 'I1 = Iin \u00D7 R2 / (R1 + R2)',
    conversions: conversionLines(read.values),
    substitution: `I1 = ${n(Iin.base)} ${AMP} \u00D7 ${n(R2.base)} ${OHM} / (${n(R1.base)} ${OHM} + ${n(R2.base)} ${OHM})`,
    steps: [`R1 + R2 = ${n(R1.base)} + ${n(R2.base)} = ${n(total)} ${OHM}`],
    calculation: `${n(Iin.base)} \u00D7 ${n(R2.base)} / ${n(total)} = ${n(i1)}`,
    related: [
      `Current through R2: I2 = Iin \u00D7 R1 / (R1 + R2) = ${formatQuantity(i2, 'current')}`,
      `Check: I1 + I2 = ${formatQuantity(i1 + i2, 'current')} (equals Iin)`,
    ],
    notes: ['The smaller resistance carries the larger share of the current.'],
  });
}
