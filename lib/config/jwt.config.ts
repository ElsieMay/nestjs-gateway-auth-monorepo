export const jwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}
