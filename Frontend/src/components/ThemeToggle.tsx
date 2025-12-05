import React from 'react';

type Props = {
  theme: 'light' | 'dark';
  onToggle: () => void;
};

// PUBLIC_INTERFACE
export default function ThemeToggle({ theme, onToggle }: Props): JSX.Element {
  /** A11y-friendly button to toggle between light and dark themes. */
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${next} mode`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
