import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

// PUBLIC_INTERFACE
export default function Login(): JSX.Element {
  /**
   * Login page: authenticates via POST /auth/login and persists token via auth store.
   * Redirects to the "from" path (if provided) or /dashboard after successful login.
   */
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: { pathname?: string } } };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState<string>('');

  useEffect(() => {
    if (token) {
      // Already logged in; redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrMsg('');
    try {
      await login(email, password);
      const from = location?.state?.from?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      const apiMessage: string | undefined =
        err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      setErrMsg(apiMessage);
    }
  }

  return (
    <section style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Login</h2>
      {errMsg ? (
        <div role="alert" aria-live="polite" style={{ color: 'tomato', marginBottom: '0.75rem' }}>
          {errMsg}
        </div>
      ) : null}
      <form aria-label="Login form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </label>
          <button type="submit" className="theme-toggle" style={{ position: 'static' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </section>
  );
}
