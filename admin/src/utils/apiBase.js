/**
 * Resolve API base URL for axios (`.../api`).
 *
 * Priority order:
 * 1. VITE_API_URL env var — explicit override (set only when you intentionally want
 *    the backend URL embedded in the bundle, e.g. during local dev without a proxy).
 * 2. LAN IP (development only) — when the page is opened via a private-network IP
 *    (e.g. from a phone on Wi-Fi), the API is assumed to be on the same host at
 *    VITE_API_PORT (default 5000).
 * 3. All other hosts (localhost or production) — use a relative /api path so that
 *    the backend URL is never embedded in the compiled bundle. The Vite dev-server
 *    proxy (localhost) or a Vercel rewrite (production) forwards /api/* to the backend.
 */
export function getApiBaseUrl() {
  const port = import.meta.env.VITE_API_PORT || '5000';

  const fromEnv = import.meta.env.VITE_API_URL || import.meta.env.vite_api_url;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim().replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    // Private-network / LAN IP — direct connection for mobile dev
    if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(hostname)) {
      return `${protocol}//${hostname}:${port}/api`;
    }
  }

  // localhost or any deployed host: use relative path (served via proxy)
  return '/api';
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
