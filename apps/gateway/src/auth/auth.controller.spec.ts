import { TestingModule, Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ValidateUserDto } from '../../../../lib/core/src/auth-domain/dto/request/validate-user.dto';
import { LoginDto } from '../../../../lib/core/src/auth-domain/dto/request/login.dto';
import { RegisterDto } from '../../../../lib/core/src/auth-domain/dto/request/register-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService with validate_user and credentials', async () => {
    const authService = controller['authService'];
    const validateUserSpy = jest.spyOn(authService, 'validateUser');
    const credentials: ValidateUserDto = {
      email: 'test@email.com',
      password: 'test',
    };

    await controller.validate_user(credentials);

    expect(validateUserSpy).toHaveBeenCalledWith(credentials);
  });

  it('should call authService with register and registerDto', async () => {
    const authService = controller['authService'];
    const registerSpy = jest.spyOn(authService, 'register');
    const mockRegisterDto: RegisterDto = {
      email: 'test@email.com',
      username: 'testuser',
      password: 'test',
    };

    await controller.register(mockRegisterDto);

    expect(registerSpy).toHaveBeenCalledWith(mockRegisterDto);
  });

  it('should call authService with login and loginDto', async () => {
    const authService = controller['authService'];
    const loginSpy = jest.spyOn(authService, 'login');
    const mockLoginDto: LoginDto = {
      email: 'test@email.com',
      password: 'test',
    };

    await controller.login(mockLoginDto);

    expect(loginSpy).toHaveBeenCalledWith(mockLoginDto);
  });

  it('should propagate exceptions from authService', async () => {
    const authService = controller['authService'];
    const credentials: ValidateUserDto = {
      email: 'test@email.com',
      password: 'test',
    };

    (authService.validateUser as jest.Mock).mockRejectedValue(
      new Error('Service error'),
    );

    await expect(controller.validate_user(credentials)).rejects.toThrow(
      'Service error',
    );
  });

  it('should handle errors from authService.login', async () => {
    const authService = controller['authService'];
    (jest.spyOn(authService, 'login') as jest.Mock).mockRejectedValue(
      new UnauthorizedException('Invalid credentials'),
    );

    await expect(
      controller.login({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
