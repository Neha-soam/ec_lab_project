import { QUANTITY_INFO, type SymbolKey } from '../../engine/physics/quantities';
import { unitsFor } from '../../engine/units/units';
import type { FieldState } from './useQuantityFields';

interface Props {
  idPrefix: string;
  /** Name shown in the label and used for the element id, for example 'I', 'R1' or 'Vin'. */
  symbol: string;
  /** The kind of quantity, when the symbol is not itself V, I, R, P or t. */
  quantity?: SymbolKey;
  /** Overrides the default quantity name in the label, for example 'Supply voltage'. */
  name?: string;
  field: FieldState;
  error?: string;
  onChange: (patch: Partial<FieldState>) => void;
}

export function QuantityInput({ idPrefix, symbol, quantity, name, field, error, onChange }: Props) {
  const { name: defaultName, kind } = QUANTITY_INFO[quantity ?? (symbol as SymbolKey)];
  const inputId = `${idPrefix}-${symbol}`;
  const errorId = `${inputId}-error`;
  const label = `${name ?? defaultName} (${symbol})`;

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <div className="field-row">
        <input
          id={inputId}
          className="input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={field.value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange({ value: e.target.value })}
        />
        <select
          className="select"
          aria-label={`${label} unit`}
          value={field.unit}
          onChange={(e) => onChange({ unit: e.target.value })}
        >
          {unitsFor(kind).map((u) => (
            <option key={u.symbol} value={u.symbol}>
              {u.symbol}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
