import { useState, type FormEvent } from 'react';
import type { CalcOutcome } from '../../engine/physics/common';
import { solveEnergy } from '../../engine/physics/energy';
import { QuantityInput } from './QuantityInput';
import { ResultPanel } from './ResultPanel';
import { useQuantityFields } from './useQuantityFields';

const SYMBOLS = ['P', 't'] as const;

export function EnergyCalculator() {
  const { fields, setField, reset, toInputs } = useQuantityFields(SYMBOLS);
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOutcome(solveEnergy(toInputs(SYMBOLS)));
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <p className="muted">Energy transferred at constant power: E = P &times; t.</p>

      <div className="field-grid">
        {SYMBOLS.map((s) => (
          <QuantityInput
            key={s}
            idPrefix="energy"
            symbol={s}
            field={fields[s]}
            error={errors[s]}
            onChange={(patch) => {
              setField(s, patch);
              setOutcome(null);
            }}
          />
        ))}
      </div>

      {errors.result && <p className="alert alert-danger" role="alert">{errors.result}</p>}

      <div className="actions">
        <button type="submit" className="btn">Calculate</button>
        <button type="button" className="btn btn-ghost" onClick={() => { reset(); setOutcome(null); }}>Reset</button>
      </div>

      {outcome?.ok && <ResultPanel result={outcome.result} />}
    </form>
  );
}
