import { PageHeader } from '../../components/PageHeader';
import { Tabs } from '../../components/Tabs';
import { EnergyCalculator } from './EnergyCalculator';
import { OhmCalculator } from './OhmCalculator';
import { PowerCalculator } from './PowerCalculator';

const TABS = [
  { id: 'ohm', label: 'Ohm\u2019s Law', panel: <OhmCalculator /> },
  { id: 'power', label: 'Power', panel: <PowerCalculator /> },
  { id: 'energy', label: 'Energy', panel: <EnergyCalculator /> },
];

export function CalculatorPage() {
  return (
    <>
      <PageHeader title="Calculator" subtitle="Worked, step-by-step electrical calculations. Unit conversions are always shown." />
      <Tabs label="Calculators" tabs={TABS} />
    </>
  );
}
