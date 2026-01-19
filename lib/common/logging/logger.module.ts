import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule, type Params } from 'nestjs-pino';

const pinoConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    ...(process.env.NODE_ENV !== 'production' && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    }),
  },
};

@Global()
@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  imports: [PinoLoggerModule.forRoot(pinoConfig)],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
