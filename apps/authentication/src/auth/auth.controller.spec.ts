import { createMockUser } from '../../../../lib/core/src/tests/fixtures/sample';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
      register: jest.fn(),
    };

    authController = new AuthController(authService as AuthService);
  });

  describe('validateUser', () => {
    it('should call authService.validateUser with correct parameters', async () => {
      const credentials = createMockUser();
      await authController.validateUser(credentials);
      expect(authService.validateUser).toHaveBeenCalledWith(credentials);
    });
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerDto = createMockUser();
      await authController.register(registerDto);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
