import type { Theme } from '../utils/theme';

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button type="button" className="btn btn-ghost" onClick={onToggle} aria-label={`Switch to ${next} mode`}>
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}
