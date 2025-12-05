import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navRoutes } from '../routes';

// PUBLIC_INTERFACE
export default function Sidebar(): JSX.Element {
  /** Responsive sidebar for section navigation (hidden on small screens). */
  const { pathname } = useLocation();

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <ul className="sidebar-list">
        {navRoutes.map((r) => (
          <li key={r.path}>
            <Link
              to={r.path}
              className={`sidebar-link ${pathname === r.path ? 'active' : ''}`}
              aria-current={pathname === r.path ? 'page' : undefined}
            >
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
