/**
 * Same rules as the storefront: LAN hostname wins over VITE_API_URL=localhost.
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

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
