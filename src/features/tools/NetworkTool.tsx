import { useState, type FormEvent } from 'react';
import type { CalcOutcome } from '../../engine/physics/common';
import { MAX_RESISTORS, MIN_RESISTORS, solveParallel, solveSeries } from '../../engine/physics/network';
import { BASE_UNIT } from '../../engine/units/units';
import { QuantityInput } from '../calculator/QuantityInput';
import { ResultPanel } from '../calculator/ResultPanel';
import { Segmented } from '../calculator/Segmented';
import type { FieldState } from '../calculator/useQuantityFields';

const MODES = [
  { value: 'series', label: 'Series' },
  { value: 'parallel', label: 'Parallel' },
] as const;

const blank = (): FieldState => ({ value: '', unit: BASE_UNIT.resistance });

/** Equivalent resistance of 2 to 10 resistors in series or in parallel. */
export function NetworkTool() {
  const [mode, setMode] = useState<'series' | 'parallel'>('series');
  const [rows, setRows] = useState<FieldState[]>([blank(), blank()]);
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};

  const update = (index: number, patch: Partial<FieldState>) => {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setOutcome(null);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const inputs = rows.map((r) => ({ raw: r.value, unit: r.unit }));
    setOutcome(mode === 'series' ? solveSeries(inputs) : solveParallel(inputs));
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <p className="muted">Enter each resistor, then choose how they are connected.</p>
      <Segmented
        label="Connection"
        options={MODES}
        value={mode}
        onChange={(m) => {
          setMode(m);
          setOutcome(null);
        }}
      />

      <div className="resistor-list">
        {rows.map((row, i) => (
          <div className="resistor-row" key={i}>
            <QuantityInput
              idPrefix="net"
              symbol={`R${i + 1}`}
              quantity="R"
              field={row}
              error={errors[`R${i + 1}`]}
              onChange={(patch) => update(i, patch)}
            />
            {rows.length > MIN_RESISTORS && (
              <button
                type="button"
                className="btn btn-ghost"
                aria-label={`Remove R${i + 1}`}
                onClick={() => {
                  setRows((r) => r.filter((_, j) => j !== i));
                  setOutcome(null);
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {errors.result && <p className="alert alert-danger" role="alert">{errors.result}</p>}

      <div className="actions">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={rows.length >= MAX_RESISTORS}
          onClick={() => {
            setRows((r) => [...r, blank()]);
            setOutcome(null);
          }}
        >
          Add resistor
        </button>
        <button type="submit" className="btn">Calculate</button>
        <button type="button" className="btn btn-ghost" onClick={() => { setRows([blank(), blank()]); setOutcome(null); }}>Reset</button>
      </div>

      {outcome?.ok && <ResultPanel result={outcome.result} />}
    </form>
  );
}
