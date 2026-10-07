import { useState, type FormEvent } from 'react';
import type { CalcOutcome } from '../../engine/physics/common';
import { solveLed } from '../../engine/physics/led';
import type { SymbolKey } from '../../engine/physics/quantities';
import { QuantityInput } from '../calculator/QuantityInput';
import { ResultPanel } from '../calculator/ResultPanel';
import { useQuantityFields } from '../calculator/useQuantityFields';

const IDS = ['Vs', 'Vf', 'I'] as const;
const QUANTITIES: Record<string, SymbolKey> = { Vs: 'V', Vf: 'V', I: 'I' };
const UNITS: Record<string, string> = { I: 'mA' };
const NAMES: Record<string, string> = { Vs: 'Supply voltage', Vf: 'LED forward voltage', I: 'Desired LED current' };

export function LedTool() {
  const { fields, setField, reset, toInputs } = useQuantityFields(IDS, QUANTITIES, UNITS);
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOutcome(solveLed(toInputs(IDS)));
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <p className="muted">
        Find the series resistor that limits an LED to a safe current. Typical forward voltage: about 2 V for red, 3 V or more for
        blue and white. Use your LED&rsquo;s datasheet.
      </p>

      <div className="field-grid">
        {IDS.map((id) => (
          <QuantityInput
            key={id}
            idPrefix="led"
            symbol={id}
            quantity={QUANTITIES[id]}
            name={NAMES[id]}
            field={fields[id]}
            error={errors[id]}
            onChange={(patch) => {
              setField(id, patch);
              setOutcome(null);
            }}
          />
        ))}
      </div>

      <div className="actions">
        <button type="submit" className="btn">Calculate resistor</button>
        <button type="button" className="btn btn-ghost" onClick={() => { reset(); setOutcome(null); }}>Reset</button>
      </div>

      {outcome?.ok && <ResultPanel result={outcome.result} />}
    </form>
  );
}
