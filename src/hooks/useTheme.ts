import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, resolveInitialTheme, type Theme } from '../utils/theme';

function readInitialTheme(): Theme {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); fall back to the OS preference.
  }
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return resolveInitialTheme(stored, Boolean(prefersDark));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore: the theme still applies for this session.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);
  return { theme, toggleTheme };
}
