//
// PUBLIC_INTERFACE
export function getApiBase(): string {
  /**
   * Returns the API base URL from environment.
   * Prefers VITE_API_BASE from env. If not set, compute a sensible local default:
   * same host as the frontend but port 3001 (backend default).
   */
  const envBase = import.meta.env.VITE_API_BASE as string | undefined;
  if (envBase && typeof envBase === 'string' && envBase.trim()) {
    return envBase.trim();
  }

  // Runtime fallback to ease local development without restarting dev server
  if (typeof window !== 'undefined' && window.location) {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    // Prefer explicit port 3001 for backend, preserve protocol (http/https)
    const computed = `${proto}//${host}:3001`;
    // eslint-disable-next-line no-console
    console.warn(`VITE_API_BASE is not set. Using computed fallback: ${computed}`);
    return computed;
  }

  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE is not set and window is unavailable. Returning empty base URL.");
  return '';
}
