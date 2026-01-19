import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from '../../../lib/core/src/users-domain/entities/user.entity';
import { AuthUsersModule } from './users/users.module';
import { databaseConfig } from '../../../lib/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('host'),
        port: configService.get<number>('port'),
        username: configService.get<string>('username'),
        password: configService.get<string>('password'),
        database: configService.get<string>('database'),
        entities: [User],
        synchronize: configService.get<boolean>('synchronize'),
        logging: process.env.NODE_ENV === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthUsersModule,
    AuthModule,
  ],
})
export class AppModule {}
