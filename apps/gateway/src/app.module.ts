import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { GatewayUsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from '../health/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: false,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        autoLogging: {
          ignore: (req) => req.url === '/health' || req.url === '/metrics',
        },
      },
    }),
    AuthModule,
    ProfileModule,
    GatewayUsersModule,
  ],
})
export class AppModule {}
