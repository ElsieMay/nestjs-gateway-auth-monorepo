import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from '../../../../lib/core/src/users-domain/dto/request/update-user.dto';
import { Observable } from 'rxjs';
import {
  UserResponseDto,
  DeleteUserResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/user-response.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  findAll(): Observable<UserResponseDto[]> {
    return this.userClient.send('find_all_users', {});
  }

  findOne(id: string): Observable<UserResponseDto> {
    return this.userClient.send('find_user_by_id', { id });
  }

  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Observable<UserResponseDto> {
    return this.userClient.send('update_user', { id, ...updateUserDto });
  }

  updatePassword(id: string, newPassword: string): Observable<UserResponseDto> {
    return this.userClient.send('update_user_password', { id, newPassword });
  }

  remove(id: string): Observable<DeleteUserResponseDto> {
    return this.userClient.send('delete_user', { id });
  }
}
