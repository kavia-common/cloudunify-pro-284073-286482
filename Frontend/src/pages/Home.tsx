import React from 'react';

// PUBLIC_INTERFACE
export default function Home(): JSX.Element {
  /** Landing/home page placeholder */
  return (
    <section style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>Welcome to CloudUnify Pro</h2>
      <p>
        Manage, analyze, and optimize resources across AWS, Azure, and GCP from a unified dashboard.
      </p>
    </section>
  );
}
