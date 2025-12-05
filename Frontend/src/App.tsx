import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { appRoutes, navRoutes } from './routes';
import { getApiBase } from './config';

// Simple nav highlighting
function useActivePath() {
  const location = useLocation();
  return location.pathname;
}

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  /**
   * Root application component.
   * - Manages light/dark theme via data-theme attribute.
   * - Provides top-level navigation and React Router configuration.
   * - Reads API base from environment to ensure configuration is wired.
   */
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Read API base once (for verification/logging; consumer modules should call getApiBase)
  useEffect(() => {
    const base = getApiBase();
    if (!base) {
      // eslint-disable-next-line no-console
      console.warn('CloudUnify Pro: API base not configured (VITE_API_BASE).');
    }
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header" role="banner">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <h1>CloudUnify Pro</h1>
          <p className="App-link" aria-live="polite">Unified multi-cloud management platform</p>

          <Navigation />
        </header>

        <main style={{ padding: '1rem' }} role="main">
          <Routes>
            {appRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Navigation(): JSX.Element {
  const active = useActivePath();
  return (
    <nav aria-label="Main Navigation" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
      {navRoutes.map((r) => (
        <Link
          key={r.path}
          to={r.path}
          style={{
            color: active === r.path ? 'var(--text-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            borderBottom: active === r.path ? '2px solid var(--text-secondary)' : '2px solid transparent',
            paddingBottom: '2px'
          }}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
}
