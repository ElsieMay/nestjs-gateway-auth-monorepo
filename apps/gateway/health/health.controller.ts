import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async publicCheck() {
    const authHost = this.configService.get<string>(
      'AUTH_SERVICE_HOST',
      'localhost',
    );
    const authUrl =
      process.env.NODE_ENV === 'production'
        ? `http://${authHost}:10000`
        : 'http://localhost:3003';
    return this.health.check([
      () => this.memory.checkRSS('memory', 300 * 1024 * 1024),
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      () =>
        this.http.pingCheck('auth-service', `${authUrl}/health`, {
          timeout: 1000,
        }),
    ]);
  }
}
