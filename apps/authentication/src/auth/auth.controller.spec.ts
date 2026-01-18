import { createMockUser } from '../../../../lib/core/src/tests/fixtures/sample';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
    };

    authController = new AuthController(authService as AuthService);
  });

  describe('validateUser', () => {
    it('should call authService.validateUser with correct parameters', async () => {
      const credentials = createMockUser();
      const expectedResult = { access_token: 'token', user: createMockUser() };
      (authService.validateUser as jest.Mock).mockResolvedValue(expectedResult);

      const result = await authController.validateUser(credentials);

      expect(authService.validateUser).toHaveBeenCalledWith(credentials);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate UnauthorizedException from service', async () => {
      const credentials = createMockUser();
      (authService.validateUser as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(authController.validateUser(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerDto = createMockUser();
      const expectedResult = { user: createMockUser() };
      (authService.register as jest.Mock).mockResolvedValue(expectedResult);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate ConflictException from service', async () => {
      const registerDto = createMockUser();
      (authService.register as jest.Mock).mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      await expect(authController.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto = createMockUser();
      const expectedResult = { access_token: 'token', user: createMockUser() };
      (authService.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate UnauthorizedException from service', async () => {
      const loginDto = createMockUser();
      (authService.login as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
