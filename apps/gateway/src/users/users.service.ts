import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from '../../../../lib/core/src/users-domain/dto/request/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  findAll() {
    return this.userClient.send('find_all_users', {});
  }

  findOne(id: string) {
    return this.userClient.send('find_user_by_id', { id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userClient.send('update_user', { id, ...updateUserDto });
  }

  updatePassword(id: string, newPassword: string) {
    return this.userClient.send('update_user_password', { id, newPassword });
  }

  remove(id: string) {
    return this.userClient.send('delete_user', { id });
  }
}
