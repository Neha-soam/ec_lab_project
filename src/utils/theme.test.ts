import { describe, it, expect } from 'vitest';
import { parseTheme, resolveInitialTheme } from './theme';

describe('theme helpers', () => {
  it('accepts only light or dark', () => {
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('blue')).toBeNull();
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme(undefined)).toBeNull();
  });

  it('prefers a stored choice over the OS preference', () => {
    expect(resolveInitialTheme('light', true)).toBe('light');
    expect(resolveInitialTheme('dark', false)).toBe('dark');
  });

  it('falls back to the OS preference for empty or invalid storage', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark');
    expect(resolveInitialTheme('', false)).toBe('light');
    expect(resolveInitialTheme('junk', true)).toBe('dark');
  });
});
