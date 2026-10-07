import { useState, type FormEvent } from 'react';
import type { CalcOutcome } from '../../engine/physics/common';
import { solveCurrentDivider, solveVoltageDivider } from '../../engine/physics/dividers';
import type { SymbolKey } from '../../engine/physics/quantities';
import { QuantityInput } from '../calculator/QuantityInput';
import { ResultPanel } from '../calculator/ResultPanel';
import { Segmented } from '../calculator/Segmented';
import { useQuantityFields } from '../calculator/useQuantityFields';

const KINDS = [
  { value: 'voltage', label: 'Voltage divider' },
  { value: 'current', label: 'Current divider' },
] as const;

const IDS = ['Vin', 'Iin', 'R1', 'R2'] as const;
const QUANTITIES: Record<string, SymbolKey> = { Vin: 'V', Iin: 'I', R1: 'R', R2: 'R' };
const NAMES: Record<string, string> = { Vin: 'Input voltage', Iin: 'Input current', R1: 'Resistor', R2: 'Resistor' };
const NEEDED = { voltage: ['Vin', 'R1', 'R2'], current: ['Iin', 'R1', 'R2'] } as const;
const HINT = {
  voltage: 'Two resistors in series. The output voltage is taken across R2.',
  current: 'Two resistors in parallel. I1 flows through R1 and I2 through R2.',
};

export function DividerTool() {
  const { fields, setField, reset, toInputs } = useQuantityFields(IDS, QUANTITIES);
  const [kind, setKind] = useState<'voltage' | 'current'>('voltage');
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};
  const needed = NEEDED[kind];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const inputs = toInputs(needed);
    setOutcome(kind === 'voltage' ? solveVoltageDivider(inputs) : solveCurrentDivider(inputs));
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <Segmented
        label="Divider type"
        options={KINDS}
        value={kind}
        onChange={(k) => {
          setKind(k);
          setOutcome(null);
        }}
      />
      <p className="muted">{HINT[kind]}</p>

      <div className="field-grid">
        {needed.map((id) => (
          <QuantityInput
            key={id}
            idPrefix="div"
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
        <button type="submit" className="btn">Calculate</button>
        <button type="button" className="btn btn-ghost" onClick={() => { reset(); setOutcome(null); }}>Reset</button>
      </div>

      {outcome?.ok && <ResultPanel result={outcome.result} />}
    </form>
  );
}
