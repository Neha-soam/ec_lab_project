import { PageHeader } from '../../components/PageHeader';
import { Tabs } from '../../components/Tabs';
import { ColourCodeTool } from './ColourCodeTool';
import { DividerTool } from './DividerTool';
import { LedTool } from './LedTool';
import { NetworkTool } from './NetworkTool';

const TABS = [
  { id: 'colour', label: 'Colour code', panel: <ColourCodeTool /> },
  { id: 'network', label: 'Series / Parallel', panel: <NetworkTool /> },
  { id: 'dividers', label: 'Dividers', panel: <DividerTool /> },
  { id: 'led', label: 'LED resistor', panel: <LedTool /> },
];

export function ToolsPage() {
  return (
    <>
      <PageHeader title="Tools" subtitle="Resistor colour codes, resistor networks, dividers and the LED series resistor." />
      <Tabs label="Tools" tabs={TABS} />
    </>
  );
}
