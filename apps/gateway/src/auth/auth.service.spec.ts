import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserDto } from '../../../../lib/core/src/auth/dto/validate-user.dto';
import { LoginDto } from '../../../../lib/core/src/auth/dto/login.dto';
import { RegisterDto } from '../../../../lib/core/src/auth/dto/register-auth.dto';
import { throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'AUTH_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should call authClient.send with 'validate_user' and credentials", () => {
    const authClient = service['authClient'];
    const sendSpy = jest.spyOn(authClient, 'send');
    const credentials: ValidateUserDto = {
      email: 'test@email.com',
      password: 'test',
    };

    service.validateUser(credentials);

    expect(sendSpy).toHaveBeenCalledWith('validate_user', credentials);
  });

  it("should call authClient.send with 'login' and loginDto", () => {
    const authClient = service['authClient'];
    const sendSpy = jest.spyOn(authClient, 'send');
    const mockLoginDto: LoginDto = {
      email: 'test@email.com',
      password: 'test',
    };

    service.login(mockLoginDto);

    expect(sendSpy).toHaveBeenCalledWith('login', mockLoginDto);
  });

  it("should call authClient.send with 'register' and registerDto", () => {
    const authClient = service['authClient'];
    const sendSpy = jest.spyOn(authClient, 'send');
    const mockRegisterDto: RegisterDto = {
      email: 'test@email.com',
      username: 'testuser',
      password: 'test',
    };

    service.register(mockRegisterDto);

    expect(sendSpy).toHaveBeenCalledWith('register', mockRegisterDto);
  });

  it('should handle microservice communication errors for validateUser', (done) => {
    const authClient = service['authClient'];
    jest
      .spyOn(authClient, 'send')
      .mockReturnValue(throwError(() => new Error('Microservice error')));

    const result = service.validateUser({
      email: 'test@email.com',
      password: 'test',
    });

    result.subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Microservice error');
        done();
      },
    });
  });

  it('should handle microservice communication errors for login', (done) => {
    const authClient = service['authClient'];
    jest
      .spyOn(authClient, 'send')
      .mockReturnValue(throwError(() => new Error('Connection refused')));

    const result = service.login({
      email: 'test@email.com',
      password: 'test',
    });

    result.subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Connection refused');
        done();
      },
    });
  });

  it('should handle microservice communication errors for register', (done) => {
    const authClient = service['authClient'];
    jest
      .spyOn(authClient, 'send')
      .mockReturnValue(throwError(() => new Error('Service unavailable')));

    const result = service.register({
      email: 'test@email.com',
      username: 'testuser',
      password: 'test',
    });

    result.subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Service unavailable');
        done();
      },
    });
  });
});
