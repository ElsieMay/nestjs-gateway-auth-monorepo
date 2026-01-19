import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          this.logger.info({
            msg: 'Request Completed',
            responseTime,
            context: LoggingInterceptor.name,
          });
        },
        error: (error: Error) => {
          const responseTime = Date.now() - now;
          this.logger.error({
            msg: 'Request Failed',
            responseTime,
            error: error instanceof Error ? error.message : String(error),
            context: LoggingInterceptor.name,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
  }
}
