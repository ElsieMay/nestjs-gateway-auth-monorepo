import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../../../../lib/core/src/users-domain/dto/request/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserClient = {
    send: jest.fn(),
  };
  const mockUpdateUserDto: UpdateUserDto = {
    username: 'New Name',
    email: 'test@email.com',
  };
  const userId = '123';
  const error = new Error('Test error');
  const newPassword = 'newPassword';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call userClient.send with correct pattern and data', () => {
      service.findAll();
      expect(mockUserClient.send).toHaveBeenCalledWith('find_all_users', {});
    });

    it('should call userClient.send with correct pattern and data', () => {
      service.findAll();
      expect(mockUserClient.send).toHaveBeenCalledWith('find_all_users', {});
    });

    it('should propagate errors from userClient.send', () => {
      mockUserClient.send.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => service.findAll()).toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should call userClient.send with correct pattern and data', () => {
      service.findOne(userId);
      expect(mockUserClient.send).toHaveBeenCalledWith('find_user_by_id', {
        id: userId,
      });
    });

    it('should propagate errors from userClient.send', () => {
      mockUserClient.send.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => service.findOne(userId)).toThrow(error);
    });
  });

  describe('update', () => {
    it('should call userClient.send with correct pattern and data', () => {
      service.update(userId, mockUpdateUserDto);
      expect(mockUserClient.send).toHaveBeenCalledWith('update_user', {
        id: userId,
        ...mockUpdateUserDto,
      });
    });

    it('should propagate errors from userClient.send', () => {
      mockUserClient.send.mockImplementationOnce(() => {
        throw error;
      });
      expect(() => service.update(userId, mockUpdateUserDto)).toThrow(error);
    });
  });

  describe('updatePassword', () => {
    it('should call userClient.send with correct pattern and data', () => {
      service.updatePassword(userId, newPassword);
      expect(mockUserClient.send).toHaveBeenCalledWith('update_user_password', {
        id: userId,
        newPassword,
      });
    });

    it('should propagate errors from userClient.send', () => {
      mockUserClient.send.mockImplementationOnce(() => {
        throw error;
      });
      expect(() => service.updatePassword(userId, newPassword)).toThrow(error);
    });
  });

  describe('remove', () => {
    it('should call userClient.send with correct pattern and data', () => {
      service.remove(userId);
      expect(mockUserClient.send).toHaveBeenCalledWith('delete_user', {
        id: userId,
      });
    });

    it('should propagate errors from userClient.send', () => {
      mockUserClient.send.mockImplementationOnce(() => {
        throw error;
      });
      expect(() => service.remove(userId)).toThrow(error);
    });
  });
});
