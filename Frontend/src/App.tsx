import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { appRoutes } from './routes';
import { getApiBase } from './config';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  /**
   * Root application component.
   * - Manages light/dark theme via data-theme attribute.
   * - Provides App layout (navbar + sidebar + content) with React Router configuration.
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
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <div className="layout">
          <Sidebar />
          <main id="main-content" className="content" role="main">
            <ErrorBoundary>
              <Routes>
                {appRoutes.map((r) => (
                  <Route
                    key={r.path}
                    path={r.path}
                    element={r.requiresAuth ? <ProtectedRoute>{r.element}</ProtectedRoute> : r.element}
                  />
                ))}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
