import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient, { setAuthTokenGetter, setUnauthorizedHandler } from '../lib/apiClient';
import type { User, LoginResponse } from '../types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  // Context methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  me: () => Promise<User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'cloudunify_auth_token';

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  /**
   * Provides authentication state (token, user) and actions (login, logout, me) to the app.
   * - Restores session from localStorage on mount.
   * - Registers axios token getter and global 401 unauthorized handler.
   */
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Register token getter and unauthorized handler for api client
  useEffect(() => {
    setAuthTokenGetter(() => token ?? (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null));
    setUnauthorizedHandler(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
      setToken(null);
      setUser(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    });
  }, [token]);

  // Try to restore session from localStorage and fetch user profile
  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) {
      setToken(t);
      me()
        .catch(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
          }
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  async function login(email: string, password: string): Promise<void> {
    /** Authenticate with backend, persist token, and load user profile if needed. */
    setLoading(true);
    try {
      const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });
      const { token: newToken, user: loginUser } = res.data ?? {};
      if (!newToken) {
        throw new Error('Token missing from login response.');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, newToken);
      }
      setToken(newToken);

      if (loginUser) {
        setUser(loginUser);
      } else {
        try {
          const u = await me();
          setUser(u);
        } catch {
          // ignore secondary failure; user remains null
        }
      }
    } catch (err) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
      setToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function me(): Promise<User> {
    /** Fetch the current authenticated user profile from backend. */
    const res = await apiClient.get<User>('/users/me');
    const u = res.data;
    setUser(u);
    return u;
  }

  // PUBLIC_INTERFACE
  function logout(): void {
    /** Clear authentication state and redirect to /login. */
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  const value = useMemo<AuthContextType>(
    () => ({ user, token, loading, login, logout, me }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  /** Hook to access authentication state and actions. Must be used within AuthProvider. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
