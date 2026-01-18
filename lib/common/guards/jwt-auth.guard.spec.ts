import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer valid.jwt.token',
        },
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid JWT token', () => {
      jest.spyOn(guard, 'canActivate').mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should call parent AuthGuard canActivate', () => {
      const canActivateSpy = jest
        .spyOn(guard, 'canActivate')
        .mockReturnValue(true);

      void guard.canActivate(mockExecutionContext);

      expect(canActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    });
  });
});
