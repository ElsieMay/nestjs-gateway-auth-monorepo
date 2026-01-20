import xss from 'xss';

/**
 * Sanitise string input to prevent XSS attacks
 * @param value - The string to sanitise
 * @returns Sanitised string with HTML entities encoded
 */
export function sanitiseString(value: string): string {
  if (typeof value !== 'string') {
    return value;
  }

  // Use xss library to sanitise input
  return xss(value, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  });
}

/**
 * Manual HTML entity encoding for extra security
 * @param value - The string to encode
 * @returns String with HTML entities encoded
 */
export function encodeHtmlEntities(value: string): string {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitise object by applying sanitisation to all string properties
 * @param obj - The object to sanitise
 * @returns sanitise object
 */
export function sanitiseObject<T extends Record<string, any>>(obj: T): T {
  const sanitised = { ...obj };

  for (const key in sanitised) {
    if (typeof sanitised[key] === 'string') {
      sanitised[key] = sanitiseString(sanitised[key]) as T[Extract<
        keyof T,
        string
      >];
    } else if (
      typeof sanitised[key] === 'object' &&
      sanitised[key] !== null &&
      !Array.isArray(sanitised[key])
    ) {
      sanitised[key] = sanitiseObject(sanitised[key]) as T[Extract<
        keyof T,
        string
      >];
    }
  }

  return sanitised;
}
