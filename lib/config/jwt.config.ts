import { Role } from '../core/src/auth-domain/enums/roles.enum';

export const jwtConfig = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required. Please set it in your .env file.',
    );
  }

  if (secret === 'your-secret-key' || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be a secure random string of at least 32 characters. Generate one using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }

  return {
    secret,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  };
};

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}
