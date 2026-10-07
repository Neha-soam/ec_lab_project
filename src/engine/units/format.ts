const SIGNIFICANT_DIGITS = 6;
/** Below this magnitude JavaScript switches to exponent notation on its own. */
const MIN_PLAIN_MAGNITUDE = 1e-6;
const MAX_PLAIN_MAGNITUDE = 1e15;

export function formatNumber(value: number, digits: number = SIGNIFICANT_DIGITS): string {
  if (!Number.isFinite(value)) return String(value);
  if (value === 0) return '0';
  const rounded = Number(value.toPrecision(digits));
  const magnitude = Math.abs(rounded);
  if (magnitude >= MIN_PLAIN_MAGNITUDE && magnitude < MAX_PLAIN_MAGNITUDE) return String(rounded);
  return rounded.toExponential();
}
