import type { ReactNode } from 'react';
import type { CalcResult } from '../../engine/physics/common';

export function ResultPanel({ result, children }: { result: CalcResult; children?: ReactNode }) {
  const { result: r } = result;
  return (
    <section className="result" aria-label="Result" aria-live="polite">
      <dl className="steps">
        <div className="step">
          <dt>Formula</dt>
          <dd><code>{result.formula}</code></dd>
        </div>
        {result.conversions.length > 0 && (
          <div className="step">
            <dt>Unit conversions</dt>
            <dd>
              {result.conversions.map((line) => (
                <code key={line} className="block">{line}</code>
              ))}
            </dd>
          </div>
        )}
        <div className="step">
          <dt>Substitution</dt>
          <dd><code>{result.substitution}</code></dd>
        </div>
        {result.steps && result.steps.length > 0 && (
          <div className="step">
            <dt>Intermediate steps</dt>
            <dd>
              {result.steps.map((line) => (
                <code key={line} className="block">{line}</code>
              ))}
            </dd>
          </div>
        )}
        <div className="step">
          <dt>Calculation</dt>
          <dd><code>{result.calculation}</code></dd>
        </div>
        <div className="step step-final">
          <dt>Final result</dt>
          <dd>
            <strong className="result-value">{r.text}</strong>
            {r.ranged && <span className="muted"> (= {r.ranged})</span>}
          </dd>
        </div>
        <div className="step">
          <dt>Unit</dt>
          <dd>{r.unitName} ({r.baseUnit})</dd>
        </div>
        {result.related && result.related.length > 0 && (
          <div className="step">
            <dt>Also calculated</dt>
            <dd>
              {result.related.map((line) => (
                <span key={line} className="line">{line}</span>
              ))}
            </dd>
          </div>
        )}
        {result.equivalents && (
          <div className="step">
            <dt>Also equal to</dt>
            <dd>{result.equivalents.join(' = ')}</dd>
          </div>
        )}
      </dl>
      {result.notes && result.notes.length > 0 && (
        <ul className="notes">
          {result.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}
