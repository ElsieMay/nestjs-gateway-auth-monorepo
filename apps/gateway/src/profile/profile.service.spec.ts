import { TestingModule, Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { ProfileService } from './profile.service';
import { of, throwError } from 'rxjs';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockUserClient = {
    send: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
        },
        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@test.com',
        roles: [Role.USER],
        createdAt: new Date('2026-01-01'),
      };

      mockUserClient.send.mockReturnValue(of(mockUser));

      const profile = await service.getProfile(userId);

      expect(profile).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        roles: mockUser.roles,
        createdAt: mockUser.createdAt,
        message: 'User profile retrieved successfully',
        user: {
          userId: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          roles: mockUser.roles,
          createdAt: mockUser.createdAt,
        },
      });
      expect(mockUserClient.send).toHaveBeenCalledWith('find_user_by_id', {
        id: userId,
      });
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle microservice errors', async () => {
      const nonExistingUserId = 'non-existing-user-id';
      const error = new Error('User not found');

      mockUserClient.send.mockReturnValue(throwError(() => error));

      await expect(service.getProfile(nonExistingUserId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getAdminData', () => {
    it('should return admin data', async () => {
      const userId = 'admin-user-id';
      const mockTotalUsers = 100;
      const mockActiveUsers = 80;

      mockUserClient.send
        .mockReturnValueOnce(of(mockTotalUsers))
        .mockReturnValueOnce(of({ activeUsers: mockActiveUsers }));

      const adminData = await service.getAdminData(userId);

      expect(adminData).toEqual({
        message: 'This is an admin-only route',
        userId: userId,
        adminData: {
          totalUsers: mockTotalUsers,
          activeUsers: mockActiveUsers,
        },
      });
      expect(mockUserClient.send).toHaveBeenNthCalledWith(
        1,
        'get_user_count',
        {},
      );
      expect(mockUserClient.send).toHaveBeenNthCalledWith(
        2,
        'get_user_stats',
        {},
      );
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors in admin data retrieval', async () => {
      const userId = 'admin-user-id';
      const error = new Error('Microservice error');

      mockUserClient.send.mockReturnValue(throwError(() => error));

      await expect(service.getAdminData(userId)).rejects.toThrow(
        'Microservice error',
      );
    });
  });

  describe('getUserCount', () => {
    it('should return total user count', async () => {
      const mockTotalUsers = 150;
      mockUserClient.send.mockReturnValueOnce(of(mockTotalUsers));

      const totalUsers = await (
        service as unknown as { getUserCount: () => Promise<number> }
      ).getUserCount();

      expect(totalUsers).toBe(mockTotalUsers);
      expect(mockUserClient.send).toHaveBeenCalledWith('get_user_count', {});
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors in user count retrieval', async () => {
      const error = new Error('Microservice error');
      mockUserClient.send.mockReturnValueOnce(throwError(() => error));

      await expect(
        (
          service as unknown as { getUserCount: () => Promise<number> }
        ).getUserCount(),
      ).rejects.toThrow('Microservice error');
    });
  });
});
