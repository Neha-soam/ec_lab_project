import { useState, type FormEvent } from 'react';
import { POWER_MODES, STANDARD_RATINGS_W, solvePower, type PowerMode, type PowerOutcome } from '../../engine/physics/power';
import { QuantityInput } from './QuantityInput';
import { ResultPanel } from './ResultPanel';
import { Segmented } from './Segmented';
import { useQuantityFields } from './useQuantityFields';

const ALL_SYMBOLS = ['V', 'I', 'R'] as const;
const MODE_OPTIONS = (Object.keys(POWER_MODES) as PowerMode[]).map((m) => ({ value: m, label: POWER_MODES[m].formula }));
const NO_RATING = 'none';

export function PowerCalculator() {
  const { fields, setField, reset, toInputs } = useQuantityFields(ALL_SYMBOLS);
  const [mode, setMode] = useState<PowerMode>('VI');
  const [rating, setRating] = useState<string>(NO_RATING);
  const [outcome, setOutcome] = useState<PowerOutcome | null>(null);

  const needed = POWER_MODES[mode].inputs;
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOutcome(solvePower(mode, toInputs(needed), rating === NO_RATING ? null : Number(rating)));
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <p className="muted">Choose a formula, then enter the values it uses.</p>
      <Segmented
        label="Power formula"
        options={MODE_OPTIONS}
        value={mode}
        onChange={(m) => {
          setMode(m);
          setOutcome(null);
        }}
      />

      <div className="field-grid">
        {needed.map((s) => (
          <QuantityInput
            key={s}
            idPrefix="power"
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

      <div className="field">
        <label htmlFor="power-rating">Resistor wattage rating (optional check)</label>
        <select
          id="power-rating"
          className="select"
          value={rating}
          onChange={(e) => {
            setRating(e.target.value);
            setOutcome(null);
          }}
        >
          <option value={NO_RATING}>No check</option>
          {STANDARD_RATINGS_W.map((r) => (
            <option key={r.watts} value={String(r.watts)}>{r.label}</option>
          ))}
        </select>
      </div>

      {errors.result && <p className="alert alert-danger" role="alert">{errors.result}</p>}

      <div className="actions">
        <button type="submit" className="btn">Calculate</button>
        <button type="button" className="btn btn-ghost" onClick={() => { reset(); setOutcome(null); }}>Reset</button>
      </div>

      {outcome?.ok && (
        <ResultPanel result={outcome.result}>
          {outcome.rating && (
            <p className={`alert ${outcome.rating.exceeds ? 'alert-danger' : 'alert-ok'}`} role={outcome.rating.exceeds ? 'alert' : 'status'}>
              {outcome.rating.message}
            </p>
          )}
        </ResultPanel>
      )}
    </form>
  );
}
