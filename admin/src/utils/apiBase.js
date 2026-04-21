/**
 * Same rules as the storefront: LAN hostname wins over env URL=localhost.
 * Fallback: also accepts lowercase `vite_api_url`.
 */
export function getApiBaseUrl() {
  const port = import.meta.env.VITE_API_PORT || '5000';

  const fromEnv = import.meta.env.VITE_API_URL || import.meta.env.vite_api_url;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim().replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:${port}/api`;
    }
  }

  return `http://localhost:${port}/api`;
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
