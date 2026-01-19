import { TestingModule, Test } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { of, throwError } from 'rxjs';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockUserClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
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
});
