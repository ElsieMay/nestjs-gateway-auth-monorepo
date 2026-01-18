import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../../config/jwt.config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockValidPayload: JwtPayload = {
    sub: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
  };

  const mockExpectedUser = {
    userId: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with valid payload', () => {
      const result = strategy.validate(mockValidPayload);

      expect(result).toEqual(mockExpectedUser);
    });

    it('should map sub to userId', () => {
      const payload: JwtPayload = {
        sub: 'abc-xyz-123',
        email: 'user@test.com',
        username: 'user',
      };

      const result = strategy.validate(payload);

      expect(result.userId).toBe('abc-xyz-123');
      expect(result).not.toHaveProperty('sub');
    });

    it('should throw UnauthorizedException if sub is missing', async () => {
      const payload = {
        email: mockValidPayload.email,
        username: mockValidPayload.username,
      } as JwtPayload;

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token payload',
      );
    });

    it('should throw UnauthorizedException if email is missing', async () => {
      const payload = {
        sub: mockValidPayload.sub,
        username: mockValidPayload.username,
      } as JwtPayload;

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token payload',
      );
    });

    it('should accept payload with optional iat and exp fields', () => {
      const payload: JwtPayload = {
        ...mockValidPayload,
        sub: 'user-456',
        email: 'demo@example.com',
        username: 'demo',
        iat: 1640995200,
        exp: 1641081600,
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-456',
        email: 'demo@example.com',
        username: 'demo',
      });
    });

    it('should handle payload with all fields', () => {
      const payload: JwtPayload = {
        ...mockValidPayload,
        sub: 'user-789',
        email: 'admin@example.com',
        username: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      };

      const result = strategy.validate(payload);

      expect(result.userId).toBe('user-789');
      expect(result.email).toBe('admin@example.com');
      expect(result.username).toBe('admin');
    });
  });
});
