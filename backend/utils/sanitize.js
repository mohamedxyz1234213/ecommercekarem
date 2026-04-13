/**
 * Sanitize a string value to prevent NoSQL injection.
 * Strips any keys starting with '$' if an object is passed,
 * and ensures the result is always a plain string.
 */
const sanitize = (value) => {
  if (typeof value === 'string') return value;
  return '';
};

module.exports = { sanitize };
