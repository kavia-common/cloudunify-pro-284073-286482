import React from 'react';

// PUBLIC_INTERFACE
export default function Login(): JSX.Element {
  /** Login page placeholder */
  return (
    <section style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Login</h2>
      <form
        aria-label="Login form"
        onSubmit={(e) => {
          e.preventDefault();
          alert('Mock login - integrate with /auth/login API');
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>
            Email
            <input type="email" name="email" required style={{ width: '100%', padding: '0.5rem' }} />
          </label>
          <label>
            Password
            <input type="password" name="password" required style={{ width: '100%', padding: '0.5rem' }} />
          </label>
          <button type="submit" className="theme-toggle" style={{ position: 'static' }}>
            Sign in
          </button>
        </div>
      </form>
    </section>
  );
}
