import { COLOURS, type ColourName } from '../../engine/resistor/colours';

/**
 * Draws a resistor with its colour bands. The colours come from the engine's colour table.
 * The tolerance band is drawn set apart from the others, as on a real resistor.
 */
export function ResistorVisual({ bands }: { bands: readonly ColourName[] }) {
  const description = bands.map((b) => COLOURS[b].label).join(', ');
  // Tolerance is the last band, except on 6-band resistors where the coefficient band follows it.
  const toleranceIndex = bands.length === 6 ? 4 : bands.length - 1;
  return (
    <div className="resistor" role="img" aria-label={`Resistor with bands: ${description}`}>
      <span className="resistor-lead" />
      <div className="resistor-body">
        {bands.map((band, i) => (
          <span
            key={i}
            className={`resistor-band${i === toleranceIndex ? ' set-apart' : ''}`}
            style={{ background: COLOURS[band].hex }}
          />
        ))}
      </div>
      <span className="resistor-lead" />
    </div>
  );
}
