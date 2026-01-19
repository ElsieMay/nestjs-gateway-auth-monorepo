export const SALT_ROUNDS = 10;
export const PASSWORD_MIN_LENGTH = 8;

// JWT Constants
export const JWT_EXPIRATION = '1h';
export const JWT_REFRESH_EXPIRATION = '7d';

// Rate Limiting
export const RATE_LIMIT_TTL = 60; // seconds
export const RATE_LIMIT_MAX = 100; // max requests per TTL

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Validation Messages
export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Invalid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
  PASSWORD_REQUIRED: 'Password is required',
  EMAIL_REQUIRED: 'Email is required',
  USERNAME_REQUIRED: 'Username is required',
} as const;

// HTTP Status Messages
export const HTTP_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden resource',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
} as const;
