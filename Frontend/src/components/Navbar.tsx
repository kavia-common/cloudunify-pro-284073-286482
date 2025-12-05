import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navRoutes } from '../routes';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../store/auth';

type Props = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme }: Props): JSX.Element {
  /** Top navigation bar with brand, primary links, theme toggle, and user menu. */
  const location = useLocation();
  const activePath = location.pathname;
  const { user, logout } = useAuth();

  return (
    <header className="navbar" role="banner">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="navbar-inner">
        <div className="brand">
          <Link to="/dashboard" className="brand-link" aria-label="CloudUnify Pro Home">
            ☁️ CloudUnify Pro
          </Link>
        </div>
        <nav aria-label="Primary" className="navbar-links">
          {navRoutes.map((r) => (
            <Link
              key={r.path}
              to={r.path}
              className={`nav-link ${activePath === r.path ? 'active' : ''}`}
              aria-current={activePath === r.path ? 'page' : undefined}
            >
              {r.label}
            </Link>
          ))}
        </nav>
        <div className="navbar-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <div className="user-menu" aria-label="Account">
            <span className="user-name" title={user?.email ?? ''}>
              {user?.name ? `Hi, ${user.name}` : ' '}
            </span>
            <button className="btn btn-secondary" onClick={logout} aria-label="Sign out">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
