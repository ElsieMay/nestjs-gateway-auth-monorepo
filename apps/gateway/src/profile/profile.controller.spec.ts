import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../../../lib/common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';
import {
  ProfileResponseDto,
  AdminResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/profile-response.dto';

interface RequestWithUser {
  user?: {
    userId: string;
    email: string;
    username: string;
    roles: Role[];
  };
}

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  const mockProfileService = {
    getProfile: jest.fn(),
    getAdminData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest<RequestWithUser>();
          request.user = {
            userId: '123',
            email: 'test@example.com',
            username: 'testuser',
            roles: [Role.USER],
          };
          return true;
        }),
      })
      .compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockAdminUser = {
    userId: '456',
    email: 'admin@example.com',
    username: 'adminuser',
    roles: [Role.ADMIN],
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockProfile: ProfileResponseDto = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        roles: [Role.USER],
        createdAt: new Date(),
        message: 'User profile retrieved successfully',
        user: {
          userId: '123',
          email: 'test',
          username: 'testuser',
          roles: [Role.USER],
          createdAt: new Date(),
        },
      };
      const getProfileSpy = jest
        .spyOn(profileService, 'getProfile')
        .mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockProfile.user);

      expect(getProfileSpy).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getAdminData', () => {
    it('should return admin data for admin user', async () => {
      const expectedResponse: AdminResponseDto = {
        message: 'This is an admin-only route',
        userId: mockAdminUser.userId,
        adminData: {
          totalUsers: 100,
          activeUsers: 75,
        },
      };

      mockProfileService.getAdminData.mockResolvedValue(expectedResponse);

      const result = await controller.getAdminData(mockAdminUser);

      expect(mockProfileService.getAdminData).toHaveBeenCalledWith(
        mockAdminUser.userId,
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
