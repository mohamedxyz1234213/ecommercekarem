/**
 * Resolve API base URL for axios (`.../api`).
 * When the page is opened via LAN IP, we always use that host for the API (before
 * VITE_API_URL) so a .env pointing at localhost does not break phones/tablets.
 * On localhost/127.0.0.1, VITE_API_URL is used if set (e.g. remote staging API).
 */
export function getApiBaseUrl() {
  const port = import.meta.env.VITE_API_PORT || '5000';

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:${port}/api`;
    }
  }

  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim().replace(/\/$/, '');
  }

  return `http://localhost:${port}/api`;
}

/** Origin only (no `/api`) — for building image/upload URLs */
export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
