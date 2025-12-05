import React from 'react';
import { useAuth } from '../store/auth';

// PUBLIC_INTERFACE
export default function Dashboard(): JSX.Element {
  /** Dashboard with quick welcome context. */
  const { user } = useAuth();

  return (
    <section className="page page-dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="subtitle">Key metrics, trends, and alerts at a glance.</p>
      </div>
      <div className="cards">
        <div className="card">
          <h3>Welcome</h3>
          <p>{user ? `Hello ${user.name} (${user.email})` : 'Hello'}</p>
          <p>Use the sidebar to navigate resources, users, and settings.</p>
        </div>
      </div>
    </section>
  );
}
