export interface NavItem {
  path: string;
  label: string;
  description: string;
  /** First development phase that delivers this section; null = not yet scheduled. */
  phase: number | null;
  /** True once the section has real content (Home, Calculator and Tools so far). */
  available: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/', label: 'Home', description: 'Start here.', phase: 1, available: true },
  { path: '/learn', label: 'Learn', description: 'Concepts and theory: voltage, current, resistance and Ohm\u2019s Law.', phase: null, available: false },
  { path: '/calculator', label: 'Calculator', description: 'Ohm\u2019s Law, power and energy with unit handling and worked steps.', phase: 2, available: true },
  { path: '/lab', label: 'Lab', description: 'Record observations and calculate R = V/I for each reading.', phase: 4, available: false },
  { path: '/experiments', label: 'Experiments', description: 'Guided experiments, starting with verification of Ohm\u2019s Law.', phase: 5, available: false },
  { path: '/analysis', label: 'Analysis', description: 'V-I graphs, best-fit slope, R\u00B2 and error analysis.', phase: 4, available: false },
  { path: '/tools', label: 'Tools', description: 'Resistor colour codes, series/parallel, dividers and LED resistor.', phase: 3, available: true },
  { path: '/practice', label: 'Practice', description: 'Numerical and viva questions by difficulty.', phase: null, available: false },
  { path: '/quiz', label: 'Quiz', description: 'Test yourself, then review formulas and explanations.', phase: null, available: false },
  { path: '/reports', label: 'Reports', description: 'Generate a lab report from your own experiment data.', phase: 10, available: false },
  { path: '/dashboard', label: 'Dashboard', description: 'Your progress across experiments and practice.', phase: null, available: false },
];

export function findNavItem(path: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.path === path);
}

export function phaseLabel(item: NavItem): string {
  if (item.available) return 'Available';
  return item.phase === null ? 'Planned' : `Phase ${item.phase}`;
}
