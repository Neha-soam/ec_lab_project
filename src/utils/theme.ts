export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ohmlab-theme';

export function parseTheme(value: unknown): Theme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/** A valid stored choice wins; otherwise follow the OS preference. */
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  return parseTheme(stored) ?? (prefersDark ? 'dark' : 'light');
}
