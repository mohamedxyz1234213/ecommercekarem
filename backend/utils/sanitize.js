/**
 * Sanitize a value to prevent NoSQL injection.
 * Ensures the result is always a plain string, stripping
 * any object/array inputs that could contain MongoDB operators like $gt, $ne.
 */
const sanitize = (value) => {
  if (typeof value !== 'string') return '';
  // Strip any characters that could be used for NoSQL operator injection
  return value.replace(/[$]/g, '');
};

module.exports = { sanitize };
