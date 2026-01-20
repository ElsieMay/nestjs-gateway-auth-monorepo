import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants/constants';

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidatePasswordStrength(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validatePasswordStrength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Your password strength validation logic
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          const minLength = value.length >= 8;

          return (
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar &&
            minLength
          );
        },
        defaultMessage() {
          return 'Password must contain uppercase, lowercase, numbers, special characters, and be at least 8 characters long';
        },
      },
    });
  };
}
