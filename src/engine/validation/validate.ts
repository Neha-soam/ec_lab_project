export type ParseResult = { ok: true; value: number } | { ok: false; error: string };

/** How a quantity may be used: 'nonNegative' allows 0, 'positive' does not. */
export type ValueRule = 'nonNegative' | 'positive';

// Plain decimal numbers only (12, 0.5, .5, 1e-3). Rejects '', 'abc', '0x10', 'Infinity'.
const DECIMAL_NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

export function validateQuantity(label: string, raw: string, rule: ValueRule): ParseResult {
  const text = raw.trim();
  if (text === '') return { ok: false, error: `Enter a value for ${label}.` };
  if (!DECIMAL_NUMBER.test(text)) {
    return { ok: false, error: `${label} must be a number, for example 12 or 0.5.` };
  }
  const value = Number(text);
  if (!Number.isFinite(value)) return { ok: false, error: `${label} is too large.` };
  if (value < 0) return { ok: false, error: `${label} cannot be negative. This calculator works with magnitudes.` };
  if (rule === 'positive' && value === 0) return { ok: false, error: `${label} must be greater than zero.` };
  return { ok: true, value };
}
