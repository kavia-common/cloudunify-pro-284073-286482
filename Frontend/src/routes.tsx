import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Login from './pages/Login';

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
  label?: string;
  hidden?: boolean;
};

// PUBLIC_INTERFACE
export const appRoutes: RouteConfig[] = [
  { path: '/home', element: <Home />, label: 'Home' },
  { path: '/dashboard', element: <Dashboard />, label: 'Dashboard' },
  { path: '/resources', element: <Resources />, label: 'Resources' },
  { path: '/settings', element: <Settings />, label: 'Settings' },
  { path: '/login', element: <Login />, label: 'Login' }
];

// PUBLIC_INTERFACE
export const navRoutes = appRoutes.filter(r => !r.hidden && r.label);
