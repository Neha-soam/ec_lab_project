import { useState } from 'react';
import { Segmented } from '../calculator/Segmented';
import { ColourDecoder } from './ColourDecoder';
import { ColourEncoder } from './ColourEncoder';

const MODES = [
  { value: 'decode', label: 'Colours \u2192 value' },
  { value: 'encode', label: 'Value \u2192 colours' },
] as const;

export function ColourCodeTool() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  return (
    <div className="calc-form">
      <Segmented label="Direction" options={MODES} value={mode} onChange={setMode} />
      <div hidden={mode !== 'decode'}>
        <ColourDecoder />
      </div>
      <div hidden={mode !== 'encode'}>
        <ColourEncoder />
      </div>
    </div>
  );
}
