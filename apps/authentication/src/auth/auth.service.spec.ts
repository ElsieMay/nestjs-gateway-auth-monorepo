import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../../lib/core/src/users-domain';
import { createMockUser } from '../../../../lib/core/src/tests/fixtures/sample';
import * as passwordUtil from '../../../../lib/common/utils/password.util';

jest.mock('../../../../lib/common/utils/password.util');

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository> & { save: jest.Mock };
  let jwtService: jest.Mocked<JwtService>;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
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
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user and return token', async () => {
      const user = createMockUser();

      usersRepository.findByEmail.mockResolvedValue(user);
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const result = await service.validateUser({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = createMockUser();
      usersRepository.findByEmail.mockResolvedValue(user);
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser({ email: 'example@email.com', password: 'wrong' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const newUser = createMockUser({ email: 'newUser@email.com' });

      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(newUser);
      (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(
        'hashedPassword',
      );
      jwtService.sign.mockReturnValue('token');

      const result = await service.register({
        email: 'newUser@email.com',
        username: 'newUser',
        password: 'password',
      });

      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('newUser@email.com');
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        'newUser@email.com',
      );
      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith(
        'newUser',
      );
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = createMockUser({ email: 'email@email.com' });
      usersRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(
        service.register({
          email: 'email@email.com',
          username: 'user',
          password: 'password',
        }),
      ).rejects.toThrow(new ConflictException('Email already in use'));
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      const existingUser = createMockUser({ username: 'existingUser' });
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(existingUser);

      await expect(
        service.register({
          email: 'new@email.com',
          username: 'existingUser',
          password: 'password',
        }),
      ).rejects.toThrow(new ConflictException('Username already in use'));
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should call validateUser with loginDto', async () => {
      const validateUserSpy = jest
        .spyOn(service, 'validateUser')
        .mockResolvedValue({
          access_token: 'token',
          user: createMockUser(),
        });

      const loginDto = { email: 'test@email.com', password: 'password' };
      const result = await service.login(loginDto);

      expect(validateUserSpy).toHaveBeenCalledWith(loginDto);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should propagate UnauthorizedException from validateUser', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      const loginDto = { email: 'wrong@email.com', password: 'wrongpass' };

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = service.healthCheck();

      expect(result).toEqual({ status: 'ok' });
      expect(mockLogger.info).toHaveBeenCalledWith('Health check requested');
    });
  });
});
