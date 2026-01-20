import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CoreUsersModule } from '../../../../lib/core/src/users-domain/users.module';
import { UsersController } from './users.controller';

@Module({
  imports: [CoreUsersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, CoreUsersModule],
})
export class AuthUsersModule {}
