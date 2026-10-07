import { describe, it, expect } from 'vitest';
import { NAV_ITEMS, findNavItem, phaseLabel } from './navigation';

describe('navigation data', () => {
  it('lists the 11 main sections with Home first', () => {
    expect(NAV_ITEMS.length).toBe(11);
    expect(NAV_ITEMS[0].path).toBe('/');
  });

  it('has unique paths that start with a slash', () => {
    const paths = NAV_ITEMS.map((i) => i.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((p) => p.startsWith('/'))).toBe(true);
  });

  it('marks only Home, Calculator and Tools as available after Phase 3', () => {
    expect(NAV_ITEMS.filter((i) => i.available).map((i) => i.path)).toEqual(['/', '/calculator', '/tools']);
  });

  it('finds items and labels their status', () => {
    expect(findNavItem('/calculator')?.label).toBe('Calculator');
    expect(findNavItem('/nope')).toBeUndefined();
    expect(phaseLabel(findNavItem('/calculator')!)).toBe('Available');
    expect(phaseLabel(findNavItem('/tools')!)).toBe('Available');
    expect(phaseLabel(findNavItem('/lab')!)).toBe('Phase 4');
    expect(phaseLabel(findNavItem('/quiz')!)).toBe('Planned');
    expect(phaseLabel(findNavItem('/')!)).toBe('Available');
  });
});
