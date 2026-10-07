import { useCallback, useState } from 'react';
import type { RawInput } from '../../engine/physics/common';
import { QUANTITY_INFO, type SymbolKey } from '../../engine/physics/quantities';
import { BASE_UNIT } from '../../engine/units/units';

export interface FieldState {
  value: string;
  unit: string;
}

type Fields = Record<string, FieldState>;

const NONE = {};

function initialFields(
  ids: readonly string[],
  quantities: Partial<Record<string, SymbolKey>>,
  units: Partial<Record<string, string>>,
): Fields {
  const fields: Fields = {};
  for (const id of ids) {
    const quantity = quantities[id] ?? (id as SymbolKey);
    fields[id] = { value: '', unit: units[id] ?? BASE_UNIT[QUANTITY_INFO[quantity].kind] };
  }
  return fields;
}

/**
 * Holds the raw text and chosen unit of each input. All numeric work is done by the engine.
 * `quantities` maps a field id such as 'Vin' to its kind ('V'); `units` sets a starting unit other than the base unit.
 * Pass module-level constants so the arguments stay stable between renders.
 */
export function useQuantityFields(
  ids: readonly string[],
  quantities: Partial<Record<string, SymbolKey>> = NONE,
  units: Partial<Record<string, string>> = NONE,
) {
  const [fields, setFields] = useState<Fields>(() => initialFields(ids, quantities, units));

  const setField = useCallback((symbol: string, patch: Partial<FieldState>) => {
    setFields((f) => ({ ...f, [symbol]: { ...f[symbol], ...patch } }));
  }, []);

  const reset = useCallback(() => setFields(initialFields(ids, quantities, units)), [ids, quantities, units]);

  const toInputs = useCallback(
    (wanted: readonly string[]): Record<string, RawInput> => {
      const inputs: Record<string, RawInput> = {};
      for (const s of wanted) inputs[s] = { raw: fields[s].value, unit: fields[s].unit };
      return inputs;
    },
    [fields],
  );

  return { fields, setField, reset, toInputs };
}
