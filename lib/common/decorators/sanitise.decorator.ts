import { Transform } from 'class-transformer';
import { sanitiseString as sanitiseString } from '../utils/sanitise.util';

/**
 * Decorator to sanitise string input and prevent XSS attacks
 * Applies XSS filtering to remove malicious HTML/JavaScript
 *
 * @example
 * class CreateUserDto {
 *   @Sanitise()
 *   username: string;
 * }
 */
export function Sanitise() {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value === 'string') {
      return sanitiseString(value);
    }
    return value;
  });
}

/**
 * Decorator to trim whitespace from string inputs
 */
export function Trim() {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
}

/**
 * Decorator to sanitise and trim string input
 * Combines both sanitisation and trimming
 */
export function SanitiseAndTrim() {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value === 'string') {
      return sanitiseString(value.trim());
    }
    return value;
  });
}
