import {
  HealthCheckService,
  MemoryHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { TestingModule, Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let memoryHealthIndicator: MemoryHealthIndicator;
  let httpHealthIndicator: HttpHealthIndicator;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest
              .fn()
              .mockResolvedValue({ memory_heap: { status: 'up' } }),
            checkRSS: jest.fn().mockResolvedValue({ memory: { status: 'up' } }),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest
              .fn()
              .mockResolvedValue({ 'auth-service': { status: 'up' } }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3003'),
          },
        },
      ],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
    healthCheckService = moduleRef.get<HealthCheckService>(HealthCheckService);
    memoryHealthIndicator = moduleRef.get<MemoryHealthIndicator>(
      MemoryHealthIndicator,
    );
    httpHealthIndicator =
      moduleRef.get<HttpHealthIndicator>(HttpHealthIndicator);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should return health check result', async () => {
    (healthCheckService.check as jest.Mock).mockResolvedValue({
      status: 'ok',
    });

    const result = await healthController.publicCheck();
    expect(result).toEqual({ status: 'ok' });
  });

  it('should call ConfigService to get auth service URL', async () => {
    (healthCheckService.check as jest.Mock).mockResolvedValue({
      status: 'ok',
    });

    await healthController.publicCheck();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(configService.get).toHaveBeenCalledWith(
      'AUTH_SERVICE_URL',
      'http://localhost:3003',
    );
  });

  it('should call all health indicators with correct parameters', async () => {
    (healthCheckService.check as jest.Mock).mockImplementation(
      async (checks: Array<() => Promise<any>>) => {
        for (const check of checks) {
          await check();
        }
        return {
          status: 'ok',
          info: {
            memory: { status: 'up' },
            memory_heap: { status: 'up' },
            'auth-service': { status: 'up' },
          },
          error: {},
          details: {
            memory: { status: 'up' },
            memory_heap: { status: 'up' },
            'auth-service': { status: 'up' },
          },
        };
      },
    );

    const result = await healthController.publicCheck();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(memoryHealthIndicator.checkRSS).toHaveBeenCalledWith(
      'memory',
      300 * 1024 * 1024,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(memoryHealthIndicator.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      200 * 1024 * 1024,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith(
      'auth-service',
      'http://localhost:3003/health',
      { timeout: 1000 },
    );
    expect(result.status).toBe('ok');
  });

  it('should pass exactly 3 health check functions to HealthCheckService', async () => {
    (healthCheckService.check as jest.Mock).mockResolvedValue({
      status: 'ok',
    });

    await healthController.publicCheck();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(healthCheckService.check).toHaveBeenCalledWith([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });

  it('should use default URL when AUTH_SERVICE_URL is not configured', async () => {
    (configService.get as jest.Mock).mockReturnValue('http://localhost:3003');
    (healthCheckService.check as jest.Mock).mockImplementation(
      async (checks: Array<() => Promise<any>>) => {
        for (const check of checks) {
          await check();
        }
        return { status: 'ok' };
      },
    );

    await healthController.publicCheck();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith(
      'auth-service',
      'http://localhost:3003/health',
      { timeout: 1000 },
    );
  });
});
