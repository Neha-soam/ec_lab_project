import { useState } from 'react';
import { decodeResistor } from '../../engine/resistor/colourCode';
import {
  BAND_LAYOUT,
  COLOURS,
  ROLE_LABEL,
  allowedColours,
  bandValueText,
  type BandCount,
  type ColourName,
} from '../../engine/resistor/colours';
import { formatNumber } from '../../engine/units/format';
import { Segmented } from '../calculator/Segmented';
import { ResistorVisual } from './ResistorVisual';

const COUNT_OPTIONS = [
  { value: '4', label: '4 bands' },
  { value: '5', label: '5 bands' },
  { value: '6', label: '6 bands' },
] as const;

const DEFAULT_BANDS: Record<BandCount, string[]> = {
  4: ['brown', 'black', 'red', 'gold'],
  5: ['brown', 'black', 'black', 'red', 'brown'],
  6: ['brown', 'black', 'black', 'red', 'brown', 'brown'],
};

/** Pick the band colours and read the value. The choices only offer valid colours, so the result updates live. */
export function ColourDecoder() {
  const [count, setCount] = useState<BandCount>(4);
  const [selection, setSelection] = useState(DEFAULT_BANDS);
  const bands = selection[count];
  const result = decodeResistor(bands);

  const setBand = (index: number, colour: string) =>
    setSelection((s) => ({ ...s, [count]: s[count].map((c, i) => (i === index ? colour : c)) }));

  return (
    <div className="calc-form">
      <p className="muted">Hold the resistor with the slightly separated tolerance band (often gold or silver) on the right, then choose each band from left to right.</p>
      <Segmented
        label="Number of bands"
        options={COUNT_OPTIONS}
        value={String(count) as '4' | '5' | '6'}
        onChange={(v) => setCount(Number(v) as BandCount)}
      />

      <div className="field-grid">
        {BAND_LAYOUT[count].map((role, i) => (
          <div className="field" key={i}>
            <label htmlFor={`decode-band-${i}`}>
              Band {i + 1} ({ROLE_LABEL[role]})
            </label>
            <select id={`decode-band-${i}`} className="select" value={bands[i]} onChange={(e) => setBand(i, e.target.value)}>
              {allowedColours(count, i).map((c) => (
                <option key={c} value={c}>
                  {COLOURS[c].label} ({bandValueText(role, c)})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <ResistorVisual bands={bands as ColourName[]} />

      {result.ok ? (
        <section className="result" aria-label="Decoded value" aria-live="polite">
          <p>
            <strong className="result-value">
              {result.text} &plusmn;{result.tolerancePercent}%
            </strong>
          </p>
          <dl className="steps">
            <div className="step">
              <dt>Exact value</dt>
              <dd>{formatNumber(result.ohms)} &Omega;</dd>
            </div>
            <div className="step">
              <dt>Possible range</dt>
              <dd>
                {result.minText} to {result.maxText}
              </dd>
            </div>
            {result.tempcoPpm !== undefined && (
              <div className="step">
                <dt>Temperature coefficient</dt>
                <dd>{result.tempcoPpm} ppm/K</dd>
              </div>
            )}
          </dl>
          <h4 className="subhead">How it was decoded</h4>
          <ol className="plain-steps">
            {result.steps.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          {result.tempcoPpm !== undefined && (
            <p className="note-small">Temperature coefficient values are typical; manufacturers differ slightly.</p>
          )}
        </section>
      ) : (
        <p className="alert alert-danger" role="alert">
          {result.error}
        </p>
      )}
    </div>
  );
}
