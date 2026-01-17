import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../lib/core/src/entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createMockUser } from '../../../../lib/core/src/tests/fixtures/sample';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user and return token', async () => {
      const user = createMockUser();

      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const result = await service.validateUser({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = createMockUser();
      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser({ email: 'example@email.com', password: 'wrong' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(
        createMockUser({ email: 'newUser@email.com' }),
      );
      userRepository.save.mockResolvedValue(
        createMockUser({ email: 'newUser@email.com' }),
      );

      const result = await service.register({
        email: 'newUser@email.com',
        username: 'newUser',
        password: 'password',
      });

      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('newUser@email.com');
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = createMockUser({ email: 'email@email.com' });
      userRepository.findOne.mockResolvedValue(existingUser);

      await expect(
        service.register({
          email: 'email@email.com',
          username: 'user',
          password: 'password',
        }),
      ).rejects.toThrow(
        new ConflictException('User with this email already exists'),
      );
    });
  });
});
