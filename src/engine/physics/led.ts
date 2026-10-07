import { nextE12AtLeast } from '../resistor/standardValues';
import { formatQuantity } from '../units/display';
import { formatNumber as n } from '../units/format';
import { BASE_UNIT, cleanFloat } from '../units/units';
import { buildResult, conversionLines, readInputs, type CalcOutcome, type RawInput } from './common';
import { STANDARD_RATINGS_W } from './power';

/** This is a low-voltage teaching tool. */
export const MAX_SUPPLY_V = 30;
/** Typical limit for small indicator LEDs; always check the datasheet. */
export const TYPICAL_LED_MAX_A = 0.02;

const VOLT = BASE_UNIT.voltage;
const AMP = BASE_UNIT.current;

/** R = (Vs \u2212 Vf) / I, so that the LED gets the current you want. */
export function solveLed(inputs: Partial<Record<string, RawInput>>): CalcOutcome {
  const read = readInputs(
    [
      { symbol: 'Vs', quantity: 'V', rule: 'positive' },
      { symbol: 'Vf', quantity: 'V', rule: 'positive' },
      { symbol: 'I', rule: 'positive' },
    ],
    inputs,
  );
  if (!read.ok) return { ok: false, errors: read.errors };

  const { Vs, Vf, I } = read.values;
  if (Vs.base > MAX_SUPPLY_V) {
    return { ok: false, errors: { Vs: `This tool is for low-voltage educational circuits (up to ${MAX_SUPPLY_V} V).` } };
  }
  if (Vs.base <= Vf.base) {
    return {
      ok: false,
      errors: { Vs: 'The supply voltage (Vs) must be greater than the LED forward voltage (Vf), or no current can flow.' },
    };
  }

  const drop = cleanFloat(Vs.base - Vf.base);
  const resistance = drop / I.base;
  const power = drop * I.base;

  const standard = nextE12AtLeast(resistance);
  const actualCurrent = drop / standard;
  const rating = STANDARD_RATINGS_W.find((r) => r.watts >= power);

  const related = [
    `Resistor power: P = (Vs \u2212 Vf) \u00D7 I = ${n(drop)} \u00D7 ${n(I.base)} = ${formatQuantity(power, 'power')}`,
    standard === cleanFloat(resistance)
      ? `${formatQuantity(standard, 'resistance')} is a standard E12 value.`
      : `Nearest standard E12 value (not below the result): ${formatQuantity(standard, 'resistance')}, giving about ${formatQuantity(actualCurrent, 'current')}.`,
    rating
      ? `Smallest standard power rating that is not exceeded: ${rating.label}.`
      : 'The power is above 5 W: choose a resistor with a higher rating.',
  ];

  const notes = ['Forward voltage depends on the LED colour and current. Use the value from the LED datasheet.'];
  if (I.base > TYPICAL_LED_MAX_A) {
    notes.unshift(`A current above about ${TYPICAL_LED_MAX_A * 1000} mA is more than small indicator LEDs usually allow. Check your LED's datasheet.`);
  }

  return buildResult('R', 'resistance', resistance, {
    formula: 'R = (Vs \u2212 Vf) / I',
    conversions: conversionLines(read.values),
    substitution: `R = (${n(Vs.base)} ${VOLT} \u2212 ${n(Vf.base)} ${VOLT}) / ${n(I.base)} ${AMP}`,
    steps: [`Voltage across the resistor: Vs \u2212 Vf = ${n(Vs.base)} \u2212 ${n(Vf.base)} = ${n(drop)} ${VOLT}`],
    calculation: `${n(drop)} / ${n(I.base)} = ${n(resistance)}`,
    related,
    notes,
  });
}
