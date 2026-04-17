import { getApiOrigin } from './apiBase';

/** Absolute URL for uploaded paths like /uploads/... when using LAN or production host */
export function resolveMediaUrl(src) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:')) return src;
  const base = getApiOrigin();
  return src.startsWith('/') ? `${base}${src}` : `${base}/${src}`;
}
