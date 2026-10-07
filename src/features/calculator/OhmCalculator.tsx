import { useState, type FormEvent } from 'react';
import type { CalcOutcome } from '../../engine/physics/common';
import { OHM_TARGETS, solveOhm, type OhmTarget } from '../../engine/physics/ohm';
import { QUANTITY_INFO } from '../../engine/physics/quantities';
import { QuantityInput } from './QuantityInput';
import { ResultPanel } from './ResultPanel';
import { Segmented } from './Segmented';
import { useQuantityFields } from './useQuantityFields';

const TARGET_OPTIONS = OHM_TARGETS.map((s) => ({ value: s, label: `${QUANTITY_INFO[s].name} (${s})` }));

export function OhmCalculator() {
  const { fields, setField, reset, toInputs } = useQuantityFields(OHM_TARGETS);
  const [target, setTarget] = useState<OhmTarget>('V');
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);

  const needed = OHM_TARGETS.filter((s) => s !== target);
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOutcome(solveOhm(target, toInputs(needed)));
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <p className="muted">Choose what to calculate, then enter the other two values.</p>
      <Segmented
        label="Quantity to calculate"
        options={TARGET_OPTIONS}
        value={target}
        onChange={(t) => {
          setTarget(t);
          setOutcome(null);
        }}
      />

      <div className="field-grid">
        {needed.map((s) => (
          <QuantityInput
            key={s}
            idPrefix="ohm"
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

      <p className="note-small">
        Ohm&rsquo;s Law describes ohmic behaviour: it applies when resistance stays approximately constant. Real
        components can be nonlinear, and temperature changes resistance.
      </p>
    </form>
  );
}
