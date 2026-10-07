import { useState, type FormEvent } from 'react';
import { encodeFromInput, type EncodeOutcome } from '../../engine/resistor/colourCode';
import {
  BAND_COUNTS,
  COLOURS,
  ROLE_LABEL,
  TEMPCO_OPTIONS,
  TOLERANCE_OPTIONS,
  bandValueText,
  type BandCount,
} from '../../engine/resistor/colours';
import { QuantityInput } from '../calculator/QuantityInput';
import { Segmented } from '../calculator/Segmented';
import { useQuantityFields } from '../calculator/useQuantityFields';
import { ResistorVisual } from './ResistorVisual';

const FIELDS = ['R'] as const;
const COUNT_OPTIONS = BAND_COUNTS.map((c) => ({ value: String(c) as '4' | '5' | '6', label: `${c} bands` }));

/** Type a resistance and get the colour bands. */
export function ColourEncoder() {
  const { fields, setField, reset, toInputs } = useQuantityFields(FIELDS);
  const [count, setCount] = useState<BandCount>(4);
  const [tolerance, setTolerance] = useState('5');
  const [tempco, setTempco] = useState('100');
  const [outcome, setOutcome] = useState<EncodeOutcome | null>(null);
  const errors: Partial<Record<string, string>> = outcome && !outcome.ok ? outcome.errors : {};

  const clear = () => setOutcome(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOutcome(
      encodeFromInput(toInputs(FIELDS).R, {
        bandCount: count,
        tolerancePercent: Number(tolerance),
        tempcoPpm: count === 6 ? Number(tempco) : undefined,
      }),
    );
  };

  return (
    <form onSubmit={submit} noValidate className="calc-form">
      <p className="muted">Enter a resistance to see which colour bands it needs.</p>
      <Segmented
        label="Number of bands"
        options={COUNT_OPTIONS}
        value={String(count) as '4' | '5' | '6'}
        onChange={(v) => {
          setCount(Number(v) as BandCount);
          clear();
        }}
      />

      <div className="field-grid">
        <QuantityInput
          idPrefix="encode"
          symbol="R"
          field={fields.R}
          error={errors.R}
          onChange={(patch) => {
            setField('R', patch);
            clear();
          }}
        />
        <div className="field">
          <label htmlFor="encode-tolerance">Tolerance</label>
          <select id="encode-tolerance" className="select" value={tolerance} onChange={(e) => { setTolerance(e.target.value); clear(); }}>
            {TOLERANCE_OPTIONS.map((t) => (
              <option key={t.percent} value={String(t.percent)}>
                &plusmn;{t.percent}% ({COLOURS[t.colour].label})
              </option>
            ))}
          </select>
        </div>
        {count === 6 && (
          <div className="field">
            <label htmlFor="encode-tempco">Temperature coefficient</label>
            <select id="encode-tempco" className="select" value={tempco} onChange={(e) => { setTempco(e.target.value); clear(); }}>
              {TEMPCO_OPTIONS.map((t) => (
                <option key={t.ppm} value={String(t.ppm)}>
                  {t.ppm} ppm/K ({COLOURS[t.colour].label})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="actions">
        <button type="submit" className="btn">Show colour bands</button>
        <button type="button" className="btn btn-ghost" onClick={() => { reset(); clear(); }}>Reset</button>
      </div>

      {outcome?.ok && (
        <>
          <ResistorVisual bands={outcome.bands} />
          <section className="result" aria-label="Colour bands" aria-live="polite">
            <p>
              <strong className="result-value">{outcome.text}</strong>
            </p>
            <ol className="plain-steps">
              {outcome.bands.map((band, i) => (
                <li key={i}>
                  Band {i + 1} ({ROLE_LABEL[outcome.roles[i]]}): <strong>{COLOURS[band].label}</strong> ({bandValueText(outcome.roles[i], band)})
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </form>
  );
}
