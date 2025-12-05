//
// PUBLIC_INTERFACE
export function getApiBase(): string {
  /**
   * Returns the API base URL from environment.
   * Expects VITE_API_BASE to be provided via .env file.
   * If not set, returns an empty string and logs a warning.
   * Consumers should handle empty string appropriately (e.g., show config error UI).
   */
  const base = import.meta.env.VITE_API_BASE as string | undefined;
  if (!base) {
    // Do not hardcode defaults; warn instead to keep configuration external.
    // eslint-disable-next-line no-console
    console.warn("VITE_API_BASE is not set. Please configure it in your environment.");
    return "";
  }
  return base;
}
