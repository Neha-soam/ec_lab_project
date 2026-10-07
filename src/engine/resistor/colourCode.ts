import { readInputs, type RawInput } from '../physics/common';
import { formatQuantity } from '../units/display';
import { formatNumber } from '../units/format';
import { cleanFloat } from '../units/units';
import {
  BAND_LAYOUT,
  COLOURS,
  ROLE_LABEL,
  allowedColours,
  bandValueText,
  coloursFor,
  type BandCount,
  type BandRole,
  type ColourName,
} from './colours';

const RESISTANCE = 'resistance' as const;
/** Digits checked when deciding whether a value fits the available significant digits. */
const CHECK_DIGITS = 11;
const MIN_MULTIPLIER_EXP = -2;
const MAX_MULTIPLIER_EXP = 9;

function isColour(value: string): value is ColourName {
  return Object.prototype.hasOwnProperty.call(COLOURS, value);
}

function digitCount(bandCount: BandCount): number {
  return bandCount === 4 ? 2 : 3;
}

// ---------------------------------------------------------------- decoding

export interface DecodeSuccess {
  ok: true;
  ohms: number;
  /** Readable value, for example "4.7 k\u03A9". */
  text: string;
  tolerancePercent: number;
  tempcoPpm?: number;
  minOhms: number;
  maxOhms: number;
  minText: string;
  maxText: string;
  /** Band-by-band explanation. */
  steps: string[];
}

export type DecodeResult = DecodeSuccess | { ok: false; error: string };

export function decodeResistor(bands: readonly string[]): DecodeResult {
  const count = bands.length;
  if (count !== 4 && count !== 5 && count !== 6) {
    return { ok: false, error: `A resistor has 4, 5 or 6 bands, but ${count} were given.` };
  }
  const layout = BAND_LAYOUT[count];

  for (let i = 0; i < count; i++) {
    const name = bands[i];
    if (!isColour(name)) return { ok: false, error: `Band ${i + 1}: "${name}" is not a resistor colour.` };
    if (!allowedColours(count, i).includes(name)) {
      const why = i === 0 && name === 'black' ? ' (the first digit cannot be 0)' : '';
      return {
        ok: false,
        error: `Band ${i + 1} is a ${ROLE_LABEL[layout[i]]} band, which cannot be ${COLOURS[name].label}${why}.`,
      };
    }
  }

  const colours = bands as readonly ColourName[];
  const n = digitCount(count);
  const digits = colours.slice(0, n).map((c) => COLOURS[c].digit as number);
  const digitsValue = Number(digits.join(''));
  const multiplierColour = colours[n];
  const exp = COLOURS[multiplierColour].multiplierExp as number;
  const toleranceColour = colours[n + 1];
  const tolerancePercent = COLOURS[toleranceColour].tolerance as number;
  const tempcoColour = count === 6 ? colours[5] : undefined;
  const tempcoPpm = tempcoColour ? COLOURS[tempcoColour].tempco : undefined;

  // Divide for negative exponents so 33 x 0.1 is exactly 3.3.
  const ohms = cleanFloat(exp >= 0 ? digitsValue * 10 ** exp : digitsValue / 10 ** -exp);
  const minOhms = cleanFloat(ohms * (1 - tolerancePercent / 100));
  const maxOhms = cleanFloat(ohms * (1 + tolerancePercent / 100));

  const steps: string[] = colours.slice(0, n).map(
    (c, i) => `Band ${i + 1} (${COLOURS[c].label}): digit ${bandValueText('digit', c)}`,
  );
  steps.push(`Digits together: ${digits.join('')}`);
  steps.push(`Band ${n + 1} (${COLOURS[multiplierColour].label}): multiplier ${bandValueText('multiplier', multiplierColour)}`);
  steps.push(`Value: ${digitsValue} ${bandValueText('multiplier', multiplierColour)} = ${formatNumber(ohms)} \u03A9`);
  steps.push(`Band ${n + 2} (${COLOURS[toleranceColour].label}): tolerance ${bandValueText('tolerance', toleranceColour)}`);
  if (tempcoColour) {
    steps.push(`Band 6 (${COLOURS[tempcoColour].label}): temperature coefficient ${bandValueText('tempco', tempcoColour)}`);
  }

  return {
    ok: true,
    ohms,
    text: formatQuantity(ohms, RESISTANCE),
    tolerancePercent,
    tempcoPpm,
    minOhms,
    maxOhms,
    minText: formatQuantity(minOhms, RESISTANCE),
    maxText: formatQuantity(maxOhms, RESISTANCE),
    steps,
  };
}

// ---------------------------------------------------------------- encoding

export interface EncodeOptions {
  bandCount: BandCount;
  tolerancePercent: number;
  /** Required for 6-band resistors. */
  tempcoPpm?: number;
}

export interface EncodeSuccess {
  ok: true;
  bands: ColourName[];
  roles: readonly BandRole[];
  ohms: number;
  text: string;
  steps: string[];
}

export type EncodeResult = EncodeSuccess | { ok: false; error: string };

function colourWithValue(role: BandRole, value: number): ColourName | undefined {
  return coloursFor(role).find((name) => {
    const c = COLOURS[name];
    const v = role === 'digit' ? c.digit : role === 'multiplier' ? c.multiplierExp : role === 'tolerance' ? c.tolerance : c.tempco;
    return v === value;
  });
}

export function encodeResistor(ohms: number, options: EncodeOptions): EncodeResult {
  const { bandCount, tolerancePercent, tempcoPpm } = options;
  if (!Number.isFinite(ohms) || ohms <= 0) return { ok: false, error: 'Resistance must be greater than zero.' };

  const toleranceColour = colourWithValue('tolerance', tolerancePercent);
  if (!toleranceColour) return { ok: false, error: `\u00B1${tolerancePercent}% is not a standard tolerance band.` };

  let tempcoColour: ColourName | undefined;
  if (bandCount === 6) {
    tempcoColour = tempcoPpm === undefined ? undefined : colourWithValue('tempco', tempcoPpm);
    if (!tempcoColour) return { ok: false, error: 'Choose a temperature coefficient for a 6-band resistor.' };
  }

  const n = digitCount(bandCount);
  const [mantissa, exponentText] = ohms.toExponential(CHECK_DIGITS).split('e');
  const allDigits = mantissa.replace('.', '');
  const exp10 = Number(exponentText);

  if (allDigits.slice(n).replace(/0/g, '') !== '') {
    const nearest = Number(ohms.toPrecision(n));
    return {
      ok: false,
      error:
        `${formatQuantity(ohms, RESISTANCE)} needs more than ${n} significant digits, so ${bandCount} bands cannot show it exactly. ` +
        (bandCount === 4 ? 'Try a 5-band resistor' : 'Round the value') +
        ` or use the nearest value, ${formatQuantity(nearest, RESISTANCE)}.`,
    };
  }

  const multiplierExp = exp10 - (n - 1);
  if (multiplierExp < MIN_MULTIPLIER_EXP || multiplierExp > MAX_MULTIPLIER_EXP) {
    const lowest = 10 ** (n - 1) * 10 ** MIN_MULTIPLIER_EXP;
    const highest = (10 ** n - 1) * 10 ** MAX_MULTIPLIER_EXP;
    return {
      ok: false,
      error: `${bandCount}-band resistors can show values from ${formatQuantity(lowest, RESISTANCE)} to ${formatQuantity(highest, RESISTANCE)}.`,
    };
  }

  const digitText = allDigits.slice(0, n);
  const digitColours = digitText.split('').map((d) => colourWithValue('digit', Number(d)) as ColourName);
  const multiplierColour = colourWithValue('multiplier', multiplierExp) as ColourName;

  const bands: ColourName[] = [...digitColours, multiplierColour, toleranceColour];
  if (tempcoColour) bands.push(tempcoColour);

  const steps = [
    `Significant digits (${n}): ${digitText.split('').join(' ')}`,
    `Multiplier: ${bandValueText('multiplier', multiplierColour)} (${COLOURS[multiplierColour].label})`,
    `Tolerance: ${bandValueText('tolerance', toleranceColour)} (${COLOURS[toleranceColour].label})`,
  ];
  if (tempcoColour) steps.push(`Temperature coefficient: ${bandValueText('tempco', tempcoColour)} (${COLOURS[tempcoColour].label})`);

  return {
    ok: true,
    bands,
    roles: BAND_LAYOUT[bandCount],
    ohms: cleanFloat(Number(digitText) * 10 ** multiplierExp),
    text: formatQuantity(ohms, RESISTANCE),
    steps,
  };
}

export type EncodeOutcome = EncodeSuccess | { ok: false; errors: Partial<Record<string, string>> };

/** Same as encodeResistor, but takes the raw text and unit the user typed. */
export function encodeFromInput(input: RawInput, options: EncodeOptions): EncodeOutcome {
  const read = readInputs([{ symbol: 'R', rule: 'positive' }], { R: input });
  if (!read.ok) return { ok: false, errors: read.errors };
  const result = encodeResistor(read.values.R.base, options);
  return result.ok ? result : { ok: false, errors: { R: result.error } };
}
