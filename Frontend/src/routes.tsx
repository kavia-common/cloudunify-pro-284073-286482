import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Users from './pages/Users';
import Organizations from './pages/Organizations';
import ResourceDetail from './pages/ResourceDetail';

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
  label?: string;
  hidden?: boolean;
  requiresAuth?: boolean;
};

// PUBLIC_INTERFACE
export const appRoutes: RouteConfig[] = [
  { path: '/home', element: <Home />, label: 'Home' },
  { path: '/dashboard', element: <Dashboard />, label: 'Dashboard', requiresAuth: true },
  { path: '/resources', element: <Resources />, label: 'Resources', requiresAuth: true },
  { path: '/resources/:id', element: <ResourceDetail />, hidden: true, requiresAuth: true },
  { path: '/organizations', element: <Organizations />, label: 'Organizations', requiresAuth: true },
  { path: '/users', element: <Users />, label: 'Users', requiresAuth: true },
  { path: '/settings', element: <Settings />, label: 'Settings', requiresAuth: true },
  { path: '/login', element: <Login />, label: 'Login', hidden: true }
];

// PUBLIC_INTERFACE
export const navRoutes = appRoutes.filter(r => !r.hidden && r.label);
