import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

// PUBLIC_INTERFACE
export function ProtectedRoute({ children }: { children: React.ReactNode }): JSX.Element {
  /** Guards routes by requiring an auth token; redirects to /login if not authenticated. */
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
