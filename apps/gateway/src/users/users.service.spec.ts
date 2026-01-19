import { TestingModule, Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { of, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../../../../lib/core/src/users-domain/dto/request/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserClient = {
    send: jest.fn().mockReturnValue(of({})),
  };

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
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
        {
          provide: PinoLogger,
          useValue: mockLogger,
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
    it('should call userClient.send with correct pattern and data', (done) => {
      const mockUsers = [{ id: '1', username: 'user1' }];
      mockUserClient.send.mockReturnValue(of(mockUsers));

      service.findAll().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(mockUserClient.send).toHaveBeenCalledWith('find_all_users', {});
        expect(mockLogger.info).toHaveBeenCalled();
        done();
      });
    });

    it('should propagate errors from userClient.send', (done) => {
      mockUserClient.send.mockReturnValue(throwError(() => error));

      service.findAll().subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('findOne', () => {
    it('should call userClient.send with correct pattern and data', (done) => {
      const mockUser = { id: userId, username: 'user1' };
      mockUserClient.send.mockReturnValue(of(mockUser));

      service.findOne(userId).subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(mockUserClient.send).toHaveBeenCalledWith('find_user_by_id', {
          id: userId,
        });
        expect(mockLogger.info).toHaveBeenCalled();
        done();
      });
    });

    it('should propagate errors from userClient.send', (done) => {
      mockUserClient.send.mockReturnValue(throwError(() => error));

      service.findOne(userId).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('update', () => {
    it('should call userClient.send with correct pattern and data', (done) => {
      const mockUpdatedUser = { id: userId, ...mockUpdateUserDto };
      mockUserClient.send.mockReturnValue(of(mockUpdatedUser));

      service.update(userId, mockUpdateUserDto).subscribe((user) => {
        expect(user).toEqual(mockUpdatedUser);
        expect(mockUserClient.send).toHaveBeenCalledWith('update_user', {
          id: userId,
          ...mockUpdateUserDto,
        });
        expect(mockLogger.info).toHaveBeenCalled();
        done();
      });
    });

    it('should propagate errors from userClient.send', (done) => {
      mockUserClient.send.mockReturnValue(throwError(() => error));

      service.update(userId, mockUpdateUserDto).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('updatePassword', () => {
    it('should call userClient.send with correct pattern and data', (done) => {
      const mockUpdatedUser = { id: userId, username: 'user1' };
      mockUserClient.send.mockReturnValue(of(mockUpdatedUser));

      service.updatePassword(userId, newPassword).subscribe((user) => {
        expect(user).toEqual(mockUpdatedUser);
        expect(mockUserClient.send).toHaveBeenCalledWith(
          'update_user_password',
          {
            id: userId,
            newPassword,
          },
        );
        expect(mockLogger.info).toHaveBeenCalled();
        done();
      });
    });

    it('should propagate errors from userClient.send', (done) => {
      mockUserClient.send.mockReturnValue(throwError(() => error));

      service.updatePassword(userId, newPassword).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('remove', () => {
    it('should call userClient.send with correct pattern and data', (done) => {
      const mockDeleteResponse = { message: 'User deleted', success: true };
      mockUserClient.send.mockReturnValue(of(mockDeleteResponse));

      service.remove(userId).subscribe((response) => {
        expect(response).toEqual(mockDeleteResponse);
        expect(mockUserClient.send).toHaveBeenCalledWith('delete_user', {
          id: userId,
        });
        expect(mockLogger.info).toHaveBeenCalled();
        done();
      });
    });

    it('should propagate errors from userClient.send', (done) => {
      mockUserClient.send.mockReturnValue(throwError(() => error));

      service.remove(userId).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });
});
