import { TestingModule, Test } from '@nestjs/testing';
import { UsersRepository } from '../../../../lib/core/src/users-domain';
import { UsersService } from './users.service';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            countByRole: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            delete: jest.fn(),
            existsByEmail: jest.fn(),
            existsByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '1',
        username: 'user1',
        email: 'test',
        password: 'hashedPassword123',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const findByIdSpy = jest
        .spyOn(usersRepository, 'findById')
        .mockResolvedValue(mockUser);

      const result = await usersService.findById('1');

      expect(result).toEqual(mockUser);
      expect(findByIdSpy).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      const findByIdSpy = jest
        .spyOn(usersRepository, 'findById')
        .mockResolvedValue(null);

      await expect(usersService.findById('1')).rejects.toThrow(
        'User with ID 1 not found',
      );

      expect(findByIdSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '1',
        username: 'user1',
        email: 'test',
        password: 'hashedPassword123',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const findByEmailSpy = jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValue(mockUser);

      const result = await usersService.findByEmail('test');

      expect(result).toEqual(mockUser);
      expect(findByEmailSpy).toHaveBeenCalledWith('test');
    });

    it('should return null when user not found', async () => {
      const findByEmailSpy = jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValue(null);

      const result = await usersService.findByEmail('test');

      expect(result).toBeNull();
      expect(findByEmailSpy).toHaveBeenCalledWith('test');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          username: 'user1',
          email: 'test1',
          password: 'hashedPassword123',
          roles: [Role.USER],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          username: 'user2',
          email: 'test2',
          password: 'hashedPassword456',
          roles: [Role.ADMIN],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const findAllSpy = jest
        .spyOn(usersRepository, 'findAll')
        .mockResolvedValue(mockUsers);

      const result = await usersService.findAll();

      expect(result).toEqual(mockUsers);
      expect(findAllSpy).toHaveBeenCalled();
    });

    it('should return an empty array when no users found', async () => {
      const findAllSpy = jest
        .spyOn(usersRepository, 'findAll')
        .mockResolvedValue([]);

      const result = await usersService.findAll();

      expect(result).toEqual([]);
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const userData = {
        email: 'test',
        username: 'user1',
        password: 'hashedPassword123',
        roles: [Role.USER],
      };

      const mockCreatedUser = {
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createSpy = jest
        .spyOn(usersRepository, 'create')
        .mockResolvedValue(mockCreatedUser);

      const result = await usersService.createUser(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(createSpy).toHaveBeenCalledWith(userData);
    });

    it('should create a user with default role USER when roles not provided', async () => {
      const userData = {
        email: 'test',
        username: 'user1',
        password: 'hashedPassword123',
      };

      const mockCreatedUser = {
        id: '1',
        ...userData,
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createSpy = jest
        .spyOn(usersRepository, 'create')
        .mockResolvedValue(mockCreatedUser);

      const result = await usersService.createUser(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(createSpy).toHaveBeenCalledWith({
        ...userData,
        roles: undefined,
      });
    });
  });

  describe('updateUser', () => {
    it('should update and return the user when found', async () => {
      const userData = {
        username: 'updatedUser',
      };

      const mockUpdatedUser = {
        id: '1',
        username: 'updatedUser',
        email: 'test',
        password: 'hashedPassword123',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateSpy = jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue(mockUpdatedUser);

      const result = await usersService.updateUser('1', userData);

      expect(result).toEqual(mockUpdatedUser);
      expect(updateSpy).toHaveBeenCalledWith('1', userData);
    });

    it('should throw NotFoundException when user to update not found', async () => {
      const userData = {
        username: 'updatedUser',
      };

      const updateSpy = jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue(null);

      await expect(usersService.updateUser('1', userData)).rejects.toThrow(
        'User with ID 1 not found',
      );

      expect(updateSpy).toHaveBeenCalledWith('1', userData);
    });
  });

  describe('updatePassword', () => {
    it('should update and return the user when found', async () => {
      const mockUpdatedUser = {
        id: '1',
        username: 'user1',
        email: 'test',
        password: 'newHashedPassword123',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateSpy = jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue(mockUpdatedUser);

      const result = await usersService.updatePassword(
        '1',
        'newHashedPassword123',
      );

      expect(result).toEqual(mockUpdatedUser);
      expect(updateSpy).toHaveBeenCalledWith('1', {
        password: 'newHashedPassword123',
      });
    });

    it('should throw NotFoundException when user to update password not found', async () => {
      const updateSpy = jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue(null);

      await expect(
        usersService.updatePassword('1', 'newHashedPassword123'),
      ).rejects.toThrow('User with ID 1 not found');

      expect(updateSpy).toHaveBeenCalledWith('1', {
        password: 'newHashedPassword123',
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete and return the user when found', async () => {
      const deleteSpy = jest
        .spyOn(usersRepository, 'delete')
        .mockResolvedValue(true);

      const result = await usersService.deleteUser('1');

      expect(result).toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user to delete not found', async () => {
      const deleteSpy = jest
        .spyOn(usersRepository, 'delete')
        .mockResolvedValue(false);

      await expect(usersService.deleteUser('1')).rejects.toThrow(
        'User with ID 1 not found',
      );

      expect(deleteSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('isEmailTaken', () => {
    it('should return true if email is taken', async () => {
      const existsByEmailSpy = jest
        .spyOn(usersRepository, 'existsByEmail')
        .mockResolvedValue(true);

      const result = await usersService.isEmailTaken('test');

      expect(result).toBe(true);
      expect(existsByEmailSpy).toHaveBeenCalledWith('test');
    });

    it('should return false if email is not taken', async () => {
      const existsByEmailSpy = jest
        .spyOn(usersRepository, 'existsByEmail')
        .mockResolvedValue(false);

      const result = await usersService.isEmailTaken('test');

      expect(result).toBe(false);
      expect(existsByEmailSpy).toHaveBeenCalledWith('test');
    });
  });

  describe('isUsernameTaken', () => {
    it('should return true if username is taken', async () => {
      const existsByUsernameSpy = jest
        .spyOn(usersRepository, 'existsByUsername')
        .mockResolvedValue(true);

      const result = await usersService.isUsernameTaken('user1');

      expect(result).toBe(true);
      expect(existsByUsernameSpy).toHaveBeenCalledWith('user1');
    });

    it('should return false if username is not taken', async () => {
      const existsByUsernameSpy = jest
        .spyOn(usersRepository, 'existsByUsername')
        .mockResolvedValue(false);

      const result = await usersService.isUsernameTaken('user1');

      expect(result).toBe(false);
      expect(existsByUsernameSpy).toHaveBeenCalledWith('user1');
    });
  });

  describe('getUserCount', () => {
    it('should return the total user count', async () => {
      const mockCount = 42;

      const getUserCountSpy = jest
        .spyOn(usersRepository, 'count')
        .mockResolvedValue(mockCount);

      const result = await usersService.getUserCount();

      expect(result).toBe(mockCount);
      expect(getUserCountSpy).toHaveBeenCalled();
    });

    it('should return zero when there are no users', async () => {
      const mockCount = 0;

      const getUserCountSpy = jest
        .spyOn(usersRepository, 'count')
        .mockResolvedValue(mockCount);

      const result = await usersService.getUserCount();

      expect(result).toBe(mockCount);
      expect(getUserCountSpy).toHaveBeenCalled();
    });
  });

  describe('getUserCountByRole', () => {
    it('should return the user count for a specific role', async () => {
      const mockCount = 10;

      const getUserCountByRoleSpy = jest
        .spyOn(usersRepository, 'countByRole')
        .mockResolvedValue(mockCount);

      const result = await usersService.getUserCountByRole(Role.USER);

      expect(result).toBe(mockCount);
      expect(getUserCountByRoleSpy).toHaveBeenCalledWith(Role.USER);
    });

    it('should return zero when there are no users with the specified role', async () => {
      const mockCount = 0;

      const getUserCountByRoleSpy = jest
        .spyOn(usersRepository, 'countByRole')
        .mockResolvedValue(mockCount);

      const result = await usersService.getUserCountByRole(Role.ADMIN);

      expect(result).toBe(mockCount);
      expect(getUserCountByRoleSpy).toHaveBeenCalledWith(Role.ADMIN);
    });
  });
});
