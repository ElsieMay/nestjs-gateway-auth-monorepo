import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersUsersService: UsersService;

  beforeEach(() => {
    usersUsersService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      deleteUser: jest.fn(),
      getUserCount: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    usersController = new UsersController(usersUsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users without passwords', async () => {
      const mockUsers = [
        { id: '1', username: 'user1', email: 'test@gmail.com' },
        { id: '2', username: 'user2', email: 'test@email.com' },
      ];

      (usersUsersService.findAll as jest.Mock).mockResolvedValue(
        mockUsers.map((user) => ({ ...user, password: 'hashedpassword' })),
      );

      const result = await usersController.findAll();
      expect(result).toEqual(mockUsers);
      expect(jest.spyOn(usersUsersService, 'findAll')).toHaveBeenCalled();
    });

    it('should handle empty user list', async () => {
      (usersUsersService.findAll as jest.Mock).mockResolvedValue([]);

      const result = await usersController.findAll();
      expect(result).toEqual([]);
      expect(jest.spyOn(usersUsersService, 'findAll')).toHaveBeenCalled();
    });

    it('should propagate errors from the service', async () => {
      (usersUsersService.findAll as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usersController.findAll()).rejects.toThrow('Database error');

      expect(jest.spyOn(usersUsersService, 'findAll')).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user without password', async () => {
      const mockUser = {
        id: '1',
        username: 'user1',
        email: 'test@gmail.com',
      };

      (usersUsersService.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'hashedpassword',
      });

      const result = await usersController.findOne({ id: '1' });
      expect(result).toEqual(mockUser);
      expect(jest.spyOn(usersUsersService, 'findById')).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should propagate errors from the service', async () => {
      (usersUsersService.findById as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      );

      await expect(usersController.findOne({ id: '1' })).rejects.toThrow(
        'User not found',
      );

      expect(jest.spyOn(usersUsersService, 'findById')).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('update', () => {
    it('should update and return the user without password', async () => {
      const mockUpdatedUser = {
        id: '1',
        username: 'updatedUser',
        email: 'test@gmail.com',
      };

      (usersUsersService.updateUser as jest.Mock).mockResolvedValue({
        ...mockUpdatedUser,
        password: 'hashedpassword',
      });

      const result = await usersController.update({
        id: '1',
        username: 'updatedUser',
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should propagate errors from service', async () => {
      (usersUsersService.updateUser as jest.Mock).mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        usersController.update({ id: '1', username: 'updatedUser' }),
      ).rejects.toThrow('Update failed');

      expect(jest.spyOn(usersUsersService, 'updateUser')).toHaveBeenCalledWith(
        '1',
        { username: 'updatedUser' },
      );
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const mockUser = {
        id: '1',
        username: 'user1',
        email: 'test',
      };

      (usersUsersService.updatePassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'newhashedpassword',
      });

      const result = await usersController.updatePassword({
        id: '1',
        newPassword: 'newPass',
      });
      expect(result).toEqual(mockUser);

      expect(
        jest.spyOn(usersUsersService, 'updatePassword'),
      ).toHaveBeenCalledWith('1', 'newPass');
    });

    it('should propagate errors from service', async () => {
      (usersUsersService.updatePassword as jest.Mock).mockRejectedValue(
        new Error('Password update failed'),
      );
      await expect(
        usersController.updatePassword({
          id: '1',
          newPassword: 'newPass',
        }),
      ).rejects.toThrow('Password update failed');

      expect(
        jest.spyOn(usersUsersService, 'updatePassword'),
      ).toHaveBeenCalledWith('1', 'newPass');
    });
  });

  describe('remove', () => {
    it('should delete the user and return a success message', async () => {
      (usersUsersService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      const result = await usersController.remove({ id: '1' });
      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(jest.spyOn(usersUsersService, 'deleteUser')).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should propagate errors from service', async () => {
      (usersUsersService.deleteUser as jest.Mock).mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(usersController.remove({ id: '1' })).rejects.toThrow(
        'Delete failed',
      );

      expect(jest.spyOn(usersUsersService, 'deleteUser')).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('getUserCount', () => {
    it('should return the user count from the service', async () => {
      (usersUsersService.getUserCount as jest.Mock).mockResolvedValue(42);

      const result = await usersController.getUserCount();
      expect(result).toBe(42);
      expect(jest.spyOn(usersUsersService, 'getUserCount')).toHaveBeenCalled();
    });

    it('should propagate errors from the service', async () => {
      (usersUsersService.getUserCount as jest.Mock).mockRejectedValue(
        new Error('Count retrieval failed'),
      );
      await expect(usersController.getUserCount()).rejects.toThrow(
        'Count retrieval failed',
      );
      expect(jest.spyOn(usersUsersService, 'getUserCount')).toHaveBeenCalled();
    });
  });
});
