import { formatNumber } from '../units/format';

export type ColourName =
  | 'black' | 'brown' | 'red' | 'orange' | 'yellow' | 'green'
  | 'blue' | 'violet' | 'grey' | 'white' | 'gold' | 'silver';

export type BandRole = 'digit' | 'multiplier' | 'tolerance' | 'tempco';
export type BandCount = 4 | 5 | 6;

export interface ColourInfo {
  name: ColourName;
  label: string;
  /** Display colour for drawing the resistor. */
  hex: string;
  digit?: number;
  /** Power of ten: the multiplier band means ×10^multiplierExp. */
  multiplierExp?: number;
  tolerance?: number;
  /** Temperature coefficient in ppm/K. Typical values; manufacturers differ. */
  tempco?: number;
}

export const BAND_COUNTS: readonly BandCount[] = [4, 5, 6];

export const COLOUR_ORDER: readonly ColourName[] = [
  'black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white', 'gold', 'silver',
];

export const COLOURS: Record<ColourName, ColourInfo> = {
  black:  { name: 'black',  label: 'Black',  hex: '#111111', digit: 0, multiplierExp: 0,  tempco: 250 },
  brown:  { name: 'brown',  label: 'Brown',  hex: '#7b4a21', digit: 1, multiplierExp: 1,  tolerance: 1,    tempco: 100 },
  red:    { name: 'red',    label: 'Red',    hex: '#d32f2f', digit: 2, multiplierExp: 2,  tolerance: 2,    tempco: 50 },
  orange: { name: 'orange', label: 'Orange', hex: '#f57c00', digit: 3, multiplierExp: 3,  tempco: 15 },
  yellow: { name: 'yellow', label: 'Yellow', hex: '#fbc02d', digit: 4, multiplierExp: 4,  tempco: 25 },
  green:  { name: 'green',  label: 'Green',  hex: '#2e7d32', digit: 5, multiplierExp: 5,  tolerance: 0.5,  tempco: 20 },
  blue:   { name: 'blue',   label: 'Blue',   hex: '#1565c0', digit: 6, multiplierExp: 6,  tolerance: 0.25, tempco: 10 },
  violet: { name: 'violet', label: 'Violet', hex: '#7b1fa2', digit: 7, multiplierExp: 7,  tolerance: 0.1,  tempco: 5 },
  grey:   { name: 'grey',   label: 'Grey',   hex: '#9e9e9e', digit: 8, multiplierExp: 8,  tolerance: 0.05, tempco: 1 },
  white:  { name: 'white',  label: 'White',  hex: '#fafafa', digit: 9, multiplierExp: 9 },
  gold:   { name: 'gold',   label: 'Gold',   hex: '#c9a227', multiplierExp: -1, tolerance: 5 },
  silver: { name: 'silver', label: 'Silver', hex: '#c0c0c0', multiplierExp: -2, tolerance: 10 },
};

export const BAND_LAYOUT: Record<BandCount, readonly BandRole[]> = {
  4: ['digit', 'digit', 'multiplier', 'tolerance'],
  5: ['digit', 'digit', 'digit', 'multiplier', 'tolerance'],
  6: ['digit', 'digit', 'digit', 'multiplier', 'tolerance', 'tempco'],
};

export const ROLE_LABEL: Record<BandRole, string> = {
  digit: 'digit',
  multiplier: 'multiplier',
  tolerance: 'tolerance',
  tempco: 'temperature coefficient',
};

function hasRole(c: ColourInfo, role: BandRole): boolean {
  switch (role) {
    case 'digit': return c.digit !== undefined;
    case 'multiplier': return c.multiplierExp !== undefined;
    case 'tolerance': return c.tolerance !== undefined;
    case 'tempco': return c.tempco !== undefined;
  }
}

export function coloursFor(role: BandRole): ColourName[] {
  return COLOUR_ORDER.filter((n) => hasRole(COLOURS[n], role));
}

/** Colours allowed at one band position. The first digit cannot be black (a leading zero). */
export function allowedColours(bandCount: BandCount, index: number): ColourName[] {
  const role = BAND_LAYOUT[bandCount][index];
  const list = coloursFor(role);
  return role === 'digit' && index === 0 ? list.filter((n) => n !== 'black') : list;
}

/** What a colour means in a given role, e.g. (multiplier, red) -> '×100'. */
export function bandValueText(role: BandRole, name: ColourName): string {
  const c = COLOURS[name];
  switch (role) {
    case 'digit': return String(c.digit);
    case 'multiplier': return `\u00D7${formatNumber(10 ** c.multiplierExp!)}`;
    case 'tolerance': return `\u00B1${c.tolerance}%`;
    case 'tempco': return `${c.tempco} ppm/K`;
  }
}

export const TOLERANCE_OPTIONS = coloursFor('tolerance').map((n) => ({
  percent: COLOURS[n].tolerance!,
  colour: n,
}));

export const TEMPCO_OPTIONS = coloursFor('tempco').map((n) => ({
  ppm: COLOURS[n].tempco!,
  colour: n,
}));
