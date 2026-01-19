import { TestingModule, Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';
import { UserResponseDto } from '../../../../lib/core/src/users-domain/dto/response/user-response.dto';
import { of } from 'rxjs';
import {
  UpdateUserDto,
  UpdatePasswordDto,
} from '../../../../lib/core/src/users-domain/dto/request/update-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const serviceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
    remove: jest.fn(),
  };

  const regularUserContext = {
    userId: 'user-uuid-123',
    email: 'regular@example.com',
    username: 'regularuser',
    roles: [Role.USER],
  };

  const adminUserContext = {
    userId: 'admin-uuid-456',
    email: 'admin@example.com',
    username: 'adminuser',
    roles: [Role.ADMIN],
  };

  const sampleUserDto: UserResponseDto = {
    id: 'user-uuid-123',
    email: 'regular@example.com',
    username: 'regularuser',
    roles: [Role.USER],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const mockNewSecurePass123 = 'NewSecurePass123!';
  const mockOtherUUID = 'other-uuid-789';

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: serviceMock }],
    }).compile();

    usersController = testModule.get<UsersController>(UsersController);
    usersService = testModule.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('controller initialization', () => {
    it('controller instance should exist', () => {
      expect(usersController).toBeDefined();
    });

    it('service instance should exist', () => {
      expect(usersService).toBeDefined();
    });
  });

  describe('findAll endpoint', () => {
    it('retrieves all user records successfully', () => {
      const userList = [sampleUserDto];
      const mockObservable = of(userList);
      serviceMock.findAll.mockReturnValue(mockObservable);

      const output = usersController.findAll();

      expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
      expect(output).toBe(mockObservable);
    });
  });

  describe('findOne endpoint', () => {
    it('retrieves own profile when user requests their own data', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.findOne.mockReturnValue(mockObservable);

      const output = usersController.findOne(
        regularUserContext.userId,
        regularUserContext,
      );

      expect(serviceMock.findOne).toHaveBeenCalledWith(
        regularUserContext.userId,
      );
      expect(output).toBe(mockObservable);
    });

    it('blocks access when user requests different profile without admin rights', () => {
      const output = usersController.findOne(mockOtherUUID, regularUserContext);

      expect(serviceMock.findOne).not.toHaveBeenCalled();
      expect(output).toEqual({ message: 'Forbidden', statusCode: 403 });
    });

    it('permits admin to access any user profile', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.findOne.mockReturnValue(mockObservable);

      const output = usersController.findOne(
        regularUserContext.userId,
        adminUserContext,
      );

      expect(serviceMock.findOne).toHaveBeenCalledWith(
        regularUserContext.userId,
      );
      expect(output).toBe(mockObservable);
    });
  });

  describe('update endpoint', () => {
    const updatePayload: UpdateUserDto = {
      username: 'updatedname',
      email: 'updated@example.com',
    };

    it('permits user to modify their own profile', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.update.mockReturnValue(mockObservable);

      const output = usersController.update(
        regularUserContext.userId,
        updatePayload,
        regularUserContext,
      );

      expect(serviceMock.update).toHaveBeenCalledWith(
        regularUserContext.userId,
        updatePayload,
      );
      expect(output).toBe(mockObservable);
    });

    it('blocks modification when user targets different profile without admin rights', () => {
      const output = usersController.update(
        mockOtherUUID,
        updatePayload,
        regularUserContext,
      );

      expect(serviceMock.update).not.toHaveBeenCalled();
      expect(output).toEqual({ message: 'Forbidden', statusCode: 403 });
    });

    it('permits admin to modify any user profile', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.update.mockReturnValue(mockObservable);

      const output = usersController.update(
        regularUserContext.userId,
        updatePayload,
        adminUserContext,
      );

      expect(serviceMock.update).toHaveBeenCalledWith(
        regularUserContext.userId,
        updatePayload,
      );
      expect(output).toBe(mockObservable);
    });
  });

  describe('updatePassword endpoint', () => {
    const passwordPayload: UpdatePasswordDto = {
      newPassword: mockNewSecurePass123,
    };

    it('permits user to change their own password', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.updatePassword.mockReturnValue(mockObservable);

      const output = usersController.updatePassword(
        regularUserContext.userId,
        passwordPayload,
        regularUserContext,
      );

      expect(serviceMock.updatePassword).toHaveBeenCalledWith(
        regularUserContext.userId,
        mockNewSecurePass123,
      );
      expect(output).toBe(mockObservable);
    });

    it('blocks password change when user targets different account without admin rights', () => {
      const output = usersController.updatePassword(
        mockOtherUUID,
        passwordPayload,
        regularUserContext,
      );

      expect(serviceMock.updatePassword).not.toHaveBeenCalled();
      expect(output).toEqual({ message: 'Forbidden', statusCode: 403 });
    });

    it('permits admin to change any user password', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.updatePassword.mockReturnValue(mockObservable);

      const output = usersController.updatePassword(
        regularUserContext.userId,
        passwordPayload,
        adminUserContext,
      );

      expect(serviceMock.updatePassword).toHaveBeenCalledWith(
        regularUserContext.userId,
        mockNewSecurePass123,
      );
      expect(output).toBe(mockObservable);
    });
  });

  describe('remove endpoint', () => {
    it('deletes user account successfully', () => {
      const mockObservable = of(sampleUserDto);
      serviceMock.remove.mockReturnValue(mockObservable);

      const output = usersController.remove(regularUserContext.userId);

      expect(serviceMock.remove).toHaveBeenCalledWith(
        regularUserContext.userId,
      );
      expect(output).toBe(mockObservable);
    });
  });
});
