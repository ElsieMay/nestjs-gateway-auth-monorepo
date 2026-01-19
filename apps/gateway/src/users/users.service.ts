import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { UpdateUserDto } from '../../../../lib/core/src/users-domain/dto/request/update-user.dto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  UserResponseDto,
  DeleteUserResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  findAll(): Observable<UserResponseDto[]> {
    this.logger.info('Sending find_all_users request to user microservice');
    return this.userClient
      .send('find_all_users', {})
      .pipe(
        tap((users) =>
          this.logger.info(
            { count: users.length },
            'Retrieved all users from microservice',
          ),
        ),
      );
  }

  findOne(id: string): Observable<UserResponseDto> {
    this.logger.info(
      { userId: id },
      'Sending find_user_by_id request to user microservice',
    );
    return this.userClient
      .send('find_user_by_id', { id })
      .pipe(
        tap((user) =>
          this.logger.info(
            { userId: user.id },
            'Retrieved user from microservice',
          ),
        ),
      );
  }

  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Observable<UserResponseDto> {
    this.logger.info(
      { userId: id },
      'Sending update_user request to user microservice',
    );
    return this.userClient
      .send('update_user', { id, ...updateUserDto })
      .pipe(
        tap(() =>
          this.logger.info({ userId: id }, 'User updated via microservice'),
        ),
      );
  }

  updatePassword(id: string, newPassword: string): Observable<UserResponseDto> {
    this.logger.info(
      { userId: id },
      'Sending update_user_password request to user microservice',
    );
    return this.userClient
      .send('update_user_password', { id, newPassword })
      .pipe(
        tap(() =>
          this.logger.info(
            { userId: id },
            'User password updated via microservice',
          ),
        ),
      );
  }

  remove(id: string): Observable<DeleteUserResponseDto> {
    this.logger.info(
      { userId: id },
      'Sending delete_user request to user microservice',
    );
    return this.userClient
      .send('delete_user', { id })
      .pipe(
        tap(() =>
          this.logger.info({ userId: id }, 'User deleted via microservice'),
        ),
      );
  }
}
