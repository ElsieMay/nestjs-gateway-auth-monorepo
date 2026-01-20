import {
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { TestingModule, Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let moduleRef: TestingModule;
  let healthCheckService: HealthCheckService;
  let memoryHealthIndicator: MemoryHealthIndicator;
  let diskHealthIndicator: DiskHealthIndicator;
  let typeOrmHealthIndicator: TypeOrmHealthIndicator;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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
            checkRSS: jest
              .fn()
              .mockResolvedValue({ memory_rss: { status: 'up' } }),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest
              .fn()
              .mockResolvedValue({ disk: { status: 'up' } }),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest
              .fn()
              .mockResolvedValue({ database: { status: 'up' } }),
          },
        },
      ],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
    healthCheckService = moduleRef.get<HealthCheckService>(HealthCheckService);
    memoryHealthIndicator = moduleRef.get<MemoryHealthIndicator>(
      MemoryHealthIndicator,
    );
    diskHealthIndicator =
      moduleRef.get<DiskHealthIndicator>(DiskHealthIndicator);
    typeOrmHealthIndicator = moduleRef.get<TypeOrmHealthIndicator>(
      TypeOrmHealthIndicator,
    );
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should return health check result', async () => {
    (healthCheckService.check as jest.Mock).mockResolvedValue({ status: 'ok' });

    const result = await healthController.check();
    expect(result).toEqual({ status: 'ok' });
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
            memory_heap: { status: 'up' },
            memory_rss: { status: 'up' },
            disk: { status: 'up' },
            database: { status: 'up' },
          },
          error: {},
          details: {
            memory_heap: { status: 'up' },
            memory_rss: { status: 'up' },
            disk: { status: 'up' },
            database: { status: 'up' },
          },
        };
      },
    );

    const result = await healthController.check();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(memoryHealthIndicator.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      150 * 1024 * 1024,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(memoryHealthIndicator.checkRSS).toHaveBeenCalledWith(
      'memory_rss',
      150 * 1024 * 1024,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(diskHealthIndicator.checkStorage).toHaveBeenCalledWith('disk', {
      thresholdPercent: 0.9,
      path: '/',
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(typeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    expect(result.status).toBe('ok');
  });

  it('should pass exactly 4 health check functions to HealthCheckService', async () => {
    (healthCheckService.check as jest.Mock).mockResolvedValue({ status: 'ok' });

    await healthController.check();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(healthCheckService.check).toHaveBeenCalledWith([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
