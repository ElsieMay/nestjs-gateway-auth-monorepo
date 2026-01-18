import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { JwtAuthGuard } from '../../../../lib/common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest<RequestWithUser>();
          request.user = {
            userId: '123',
            email: 'test@example.com',
            username: 'testuser',
          };
          return true;
        },
      })
      .compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return protected route message with user data', () => {
      const mockUser = {
        userId: '123',
        email: 'test@example.com',
        username: 'testuser',
      };

      const result = controller.getProfile(mockUser);

      expect(result).toEqual({
        message: 'This is a protected route',
        user: mockUser,
      });
    });

    it('should return user data from authenticated request', () => {
      const mockUser = {
        userId: 'user-456',
        email: 'demo@example.com',
        username: 'demo',
      };

      const result = controller.getProfile(mockUser);

      expect(result.user).toEqual(mockUser);
      expect(result.user.userId).toBe('user-456');
      expect(result.user.email).toBe('demo@example.com');
      expect(result.user.username).toBe('demo');
    });

    it('should have message property in response', () => {
      const mockUser = {
        userId: '789',
        email: 'another@example.com',
        username: 'another',
      };

      const result = controller.getProfile(mockUser);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('This is a protected route');
    });
  });
});
