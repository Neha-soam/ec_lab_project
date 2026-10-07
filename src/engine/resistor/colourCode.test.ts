import { describe, it, expect } from 'vitest';
import { allowedColours, bandValueText } from './colours';
import { decodeResistor, encodeFromInput, encodeResistor } from './colourCode';

function decode(...bands: string[]) {
  const r = decodeResistor(bands);
  if (!r.ok) throw new Error(r.error);
  return r;
}
function encode(ohms: number, bandCount: 4 | 5 | 6, tolerancePercent = 5, tempcoPpm?: number) {
  const r = encodeResistor(ohms, { bandCount, tolerancePercent, tempcoPpm });
  if (!r.ok) throw new Error(r.error);
  return r;
}
function encodeError(ohms: number, bandCount: 4 | 5 | 6, tolerancePercent = 5, tempcoPpm?: number) {
  const r = encodeResistor(ohms, { bandCount, tolerancePercent, tempcoPpm });
  return r.ok ? '' : r.error;
}

describe('decodeResistor: 4 bands', () => {
  it('yellow violet red gold = 4.7 k\u03A9 \u00B15%', () => {
    const r = decode('yellow', 'violet', 'red', 'gold');
    expect(r.ohms).toBe(4700);
    expect(r.text).toBe('4.7 k\u03A9');
    expect(r.tolerancePercent).toBe(5);
    expect(r.minOhms).toBe(4465);
    expect(r.maxOhms).toBe(4935);
  });
  it('brown black red gold = 1 k\u03A9', () => {
    expect(decode('brown', 'black', 'red', 'gold').ohms).toBe(1000);
  });
  it('orange orange gold gold = 3.3 \u03A9 (gold multiplier is x0.1, no float noise)', () => {
    expect(decode('orange', 'orange', 'gold', 'gold').ohms).toBe(3.3);
  });
  it('brown black silver gold = 0.1 \u03A9 (silver multiplier is x0.01)', () => {
    const r = decode('brown', 'black', 'silver', 'gold');
    expect(r.ohms).toBe(0.1);
    expect(r.text).toBe('0.1 \u03A9');
  });
  it('red red green silver = 2.2 M\u03A9 \u00B110%', () => {
    const r = decode('red', 'red', 'green', 'silver');
    expect(r.ohms).toBe(2200000);
    expect(r.text).toBe('2.2 M\u03A9');
    expect(r.tolerancePercent).toBe(10);
  });
  it('black multiplier means x1: green blue black red = 56 \u03A9', () => {
    expect(decode('green', 'blue', 'black', 'red').ohms).toBe(56);
  });
  it('explains each band', () => {
    const r = decode('yellow', 'violet', 'red', 'gold');
    expect(r.steps[0]).toBe('Band 1 (Yellow): digit 4');
    expect(r.steps.join('|')).toContain('Value: 47 \u00D7100 = 4700 \u03A9');
    expect(r.steps[r.steps.length - 1]).toBe('Band 4 (Gold): tolerance \u00B15%');
  });
});

describe('decodeResistor: 5 and 6 bands', () => {
  it('5-band brown black black red brown = 10 k\u03A9 \u00B11%', () => {
    const r = decode('brown', 'black', 'black', 'red', 'brown');
    expect(r.ohms).toBe(10000);
    expect(r.tolerancePercent).toBe(1);
  });
  it('5-band green blue black black brown = 560 \u03A9 \u00B11%', () => {
    expect(decode('green', 'blue', 'black', 'black', 'brown').ohms).toBe(560);
  });
  it('6-band adds the temperature coefficient', () => {
    const r = decode('brown', 'black', 'black', 'red', 'brown', 'red');
    expect(r.ohms).toBe(10000);
    expect(r.tempcoPpm).toBe(50);
    expect(r.steps[r.steps.length - 1]).toBe('Band 6 (Red): temperature coefficient 50 ppm/K');
  });
  it('4 and 5-band results have no temperature coefficient', () => {
    expect(decode('brown', 'black', 'red', 'gold').tempcoPpm).toBeUndefined();
  });
});

describe('decodeResistor: invalid input', () => {
  const err = (...b: string[]) => {
    const r = decodeResistor(b);
    return r.ok ? '' : r.error;
  };
  it('rejects the wrong number of bands', () => {
    expect(err('red', 'red', 'red')).toBe('A resistor has 4, 5 or 6 bands, but 3 were given.');
    expect(err()).toBe('A resistor has 4, 5 or 6 bands, but 0 were given.');
    expect(err('a', 'b', 'c', 'd', 'e', 'f', 'g')).toBe('A resistor has 4, 5 or 6 bands, but 7 were given.');
  });
  it('rejects unknown colours (including prototype names)', () => {
    expect(err('pink', 'red', 'red', 'gold')).toBe('Band 1: "pink" is not a resistor colour.');
    expect(err('toString', 'red', 'red', 'gold')).toBe('Band 1: "toString" is not a resistor colour.');
  });
  it('rejects a black first digit', () => {
    expect(err('black', 'red', 'red', 'gold')).toBe('Band 1 is a digit band, which cannot be Black (the first digit cannot be 0).');
  });
  it('rejects colours that make no sense in a position', () => {
    expect(err('red', 'red', 'red', 'orange')).toBe('Band 4 is a tolerance band, which cannot be Orange.');
    expect(err('red', 'red', 'gold', 'gold')).toBe('') ;
    expect(err('red', 'gold', 'red', 'gold')).toBe('Band 2 is a digit band, which cannot be Gold.');
    expect(err('red', 'red', 'red', 'red', 'red', 'white')).toBe('Band 6 is a temperature coefficient band, which cannot be White.');
  });
});

describe('encodeResistor', () => {
  it('4.7 k\u03A9 \u00B15% (4-band) = yellow violet red gold', () => {
    expect(encode(4700, 4).bands).toEqual(['yellow', 'violet', 'red', 'gold']);
  });
  it('1 k\u03A9 = brown black red', () => {
    expect(encode(1000, 4).bands.slice(0, 3)).toEqual(['brown', 'black', 'red']);
  });
  it('0.1 \u03A9 = brown black silver; 3.3 \u03A9 = orange orange gold', () => {
    expect(encode(0.1, 4).bands.slice(0, 3)).toEqual(['brown', 'black', 'silver']);
    expect(encode(3.3, 4).bands.slice(0, 3)).toEqual(['orange', 'orange', 'gold']);
  });
  it('2.2 M\u03A9 = red red green', () => {
    expect(encode(2200000, 4).bands.slice(0, 3)).toEqual(['red', 'red', 'green']);
  });
  it('5-band 10 k\u03A9 \u00B11% = brown black black red brown', () => {
    expect(encode(10000, 5, 1).bands).toEqual(['brown', 'black', 'black', 'red', 'brown']);
  });
  it('6-band adds the temperature coefficient colour', () => {
    expect(encode(10000, 6, 1, 50).bands).toEqual(['brown', 'black', 'black', 'red', 'brown', 'red']);
  });
  it('4750 \u03A9 needs 3 digits: 5-band works, 4-band explains and suggests the nearest value', () => {
    expect(encode(4750, 5).bands.slice(0, 4)).toEqual(['yellow', 'violet', 'green', 'brown']);
    expect(encodeError(4750, 4)).toBe(
      '4.75 k\u03A9 needs more than 2 significant digits, so 4 bands cannot show it exactly. Try a 5-band resistor or use the nearest value, 4.8 k\u03A9.',
    );
  });
  it('ignores floating-point noise in the input (0.1 + 0.2 = 0.3 \u03A9)', () => {
    expect(encode(0.1 + 0.2, 4).bands.slice(0, 3)).toEqual(['orange', 'black', 'silver']);
  });
  it('rejects values outside the range the bands can show', () => {
    expect(encodeError(0.05, 4)).toBe('4-band resistors can show values from 0.1 \u03A9 to 99000 M\u03A9.');
    expect(encodeError(1e12, 4)).toContain('can show values from');
  });
  it('rejects zero, negative and non-finite values', () => {
    for (const v of [0, -5, NaN, Infinity]) expect(encodeError(v, 4)).toBe('Resistance must be greater than zero.');
  });
  it('rejects an unusable tolerance and a missing 6-band coefficient', () => {
    expect(encodeError(100, 4, 3)).toBe('\u00B13% is not a standard tolerance band.');
    expect(encodeError(100, 6, 5)).toBe('Choose a temperature coefficient for a 6-band resistor.');
    expect(encodeError(100, 6, 5, 7)).toBe('Choose a temperature coefficient for a 6-band resistor.');
  });
});

describe('colour code round trips', () => {
  it('every E12 value in every decade encodes and decodes back to itself', () => {
    const mantissas = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
    let checked = 0;
    for (const m of mantissas) {
      for (let exp = -2; exp <= 7; exp++) {
        const ohms = exp >= 0 ? m * 10 ** exp : m / 10 ** -exp;
        for (const count of [4, 5] as const) {
          if (count === 5 && ohms < 1) continue; // 5-band resistors start at 1 \u03A9
          const e = encode(ohms, count);
          const d = decode(...e.bands);
          expect(d.ohms).toBe(Number(ohms.toPrecision(12)));
          checked++;
        }
      }
    }
    expect(checked).toBe(228); // 120 four-band + 108 five-band
  });
});

describe('encodeFromInput (what the form calls)', () => {
  it('converts units first: 4.7 k\u03A9', () => {
    const r = encodeFromInput({ raw: '4.7', unit: 'k\u03A9' }, { bandCount: 4, tolerancePercent: 5 });
    expect(r.ok && r.bands).toEqual(['yellow', 'violet', 'red', 'gold']);
  });
  it('reports empty and invalid input under the R field', () => {
    for (const [raw, msg] of [['', 'Enter a value for R.'], ['abc', 'R must be a number, for example 12 or 0.5.'], ['0', 'R must be greater than zero.']] as const) {
      const r = encodeFromInput({ raw, unit: '\u03A9' }, { bandCount: 4, tolerancePercent: 5 });
      expect(r.ok ? '' : r.errors.R).toBe(msg);
    }
  });
  it('reports a value that does not fit under R too', () => {
    const r = encodeFromInput({ raw: '4750', unit: '\u03A9' }, { bandCount: 4, tolerancePercent: 5 });
    expect(r.ok ? '' : r.errors.R).toContain('nearest value, 4.8 k\u03A9');
  });
});

describe('band tables', () => {
  it('offers the right colours per position', () => {
    expect(allowedColours(4, 0).includes('black')).toBe(false);
    expect(allowedColours(4, 1).includes('black')).toBe(true);
    expect(allowedColours(4, 2).length).toBe(12);
    expect(allowedColours(4, 3)).toEqual(['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver']);
    expect(allowedColours(6, 5)).toEqual(['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey']);
  });
  it('describes what a colour means in each role', () => {
    expect(bandValueText('digit', 'red')).toBe('2');
    expect(bandValueText('multiplier', 'red')).toBe('\u00D7100');
    expect(bandValueText('multiplier', 'gold')).toBe('\u00D70.1');
    expect(bandValueText('multiplier', 'silver')).toBe('\u00D70.01');
    expect(bandValueText('tolerance', 'gold')).toBe('\u00B15%');
    expect(bandValueText('tempco', 'brown')).toBe('100 ppm/K');
  });
});
