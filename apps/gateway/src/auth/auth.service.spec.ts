import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { ValidateUserDto } from '../../../../lib/core/src/auth-domain/dto/request/validate-user.dto';
import { LoginDto } from '../../../../lib/core/src/auth-domain/dto/request/login.dto';
import { RegisterDto } from '../../../../lib/core/src/auth-domain/dto/request/register-auth.dto';
import { throwError, of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

describe('AuthService', () => {
  let service: AuthService;
  let mockClient: ClientProxy;
  // let logger: jest.Mocked<PinoLogger>;

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    mockClient = {
      send: jest.fn().mockReturnValue(of({})),
    } as unknown as ClientProxy;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'AUTH_SERVICE',
          useValue: mockClient,
        },
        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // logger = module.get(PinoLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should call client.send with 'validateUser' and credentials", async () => {
    const credentials: ValidateUserDto = {
      email: 'test@email.com',
      password: 'test',
    };

    const expectedResult = {
      access_token: 'mock-token',
      user: { id: '1', email: 'test@email.com', username: 'testuser' },
    };

    const sendSpy = jest
      .spyOn(mockClient, 'send')
      .mockReturnValue(of(expectedResult));

    const result = await service.validateUser(credentials);

    expect(sendSpy).toHaveBeenCalledWith('validateUser', credentials);
    expect(result).toEqual(expectedResult);
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it("should call client.send with 'login' and loginDto", async () => {
    const mockLoginDto: LoginDto = {
      email: 'test@gmail.com',
      password: 'testpassword',
    };

    const expectedResult = {
      access_token: 'mock-token',
      user: { id: '1', email: 'test@gmail.com', username: 'testuser' },
    };

    const sendSpy = jest
      .spyOn(mockClient, 'send')
      .mockReturnValue(of(expectedResult));

    const result = await service.login(mockLoginDto);

    expect(sendSpy).toHaveBeenCalledWith('login', mockLoginDto);
    expect(result).toEqual(expectedResult);
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it("should call client.send with 'register' and registerDto", async () => {
    const mockRegisterDto: RegisterDto = {
      email: 'test@email.com',
      username: 'testuser',
      password: 'test',
    };

    const expectedResult = {
      access_token: 'mock-token',
      user: { id: '1', email: 'test@email.com', username: 'testuser' },
    };

    const sendSpy = jest
      .spyOn(mockClient, 'send')
      .mockReturnValue(of(expectedResult));

    const result = await service.register(mockRegisterDto);

    expect(sendSpy).toHaveBeenCalledWith('register', mockRegisterDto);
    expect(result).toEqual(expectedResult);
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should handle microservice communication errors for validateUser', async () => {
    jest
      .spyOn(mockClient, 'send')
      .mockReturnValue(throwError(() => new Error('Microservice error')));

    await expect(
      service.validateUser({
        email: 'test@email.com',
        password: 'test',
      }),
    ).rejects.toThrow('Microservice error');
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should handle microservice communication errors for login', async () => {
    jest
      .spyOn(mockClient, 'send')
      .mockReturnValue(throwError(() => new Error('Connection refused')));

    await expect(
      service.login({
        email: 'test@email.com',
        password: 'test',
      }),
    ).rejects.toThrow('Connection refused');
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should handle microservice communication errors for register', async () => {
    jest
      .spyOn(mockClient, 'send')
      .mockReturnValue(throwError(() => new Error('Service unavailable')));

    await expect(
      service.register({
        email: 'test@email.com',
        username: 'testuser',
        password: 'test',
      }),
    ).rejects.toThrow('Service unavailable');
    expect(mockLogger.info).toHaveBeenCalled();
  });
});
