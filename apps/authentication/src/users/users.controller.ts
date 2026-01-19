import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  UserResponseDto,
  DeleteUserResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/user-response.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private excludePassword<T extends { password?: string }>(
    user: T,
  ): Omit<T, 'password'> {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  @MessagePattern('find_all_users')
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => this.excludePassword(user)) as UserResponseDto[];
  }

  @MessagePattern('find_user_by_id')
  async findOne(@Payload() data: { id: string }): Promise<UserResponseDto> {
    const user = await this.usersService.findById(data.id);
    return this.excludePassword(user) as UserResponseDto;
  }

  @MessagePattern('update_user')
  async update(
    @Payload() data: { id: string; username?: string; email?: string },
  ): Promise<UserResponseDto> {
    const { id, ...updateData } = data;
    const user = await this.usersService.updateUser(id, updateData);
    return this.excludePassword(user) as UserResponseDto;
  }

  @MessagePattern('update_user_password')
  async updatePassword(
    @Payload() data: { id: string; newPassword: string },
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updatePassword(
      data.id,
      data.newPassword,
    );
    return this.excludePassword(user) as UserResponseDto;
  }

  @MessagePattern('delete_user')
  async remove(
    @Payload() data: { id: string },
  ): Promise<DeleteUserResponseDto> {
    await this.usersService.deleteUser(data.id);
    return { message: 'User deleted successfully' };
  }

  @MessagePattern('get_user_count')
  async getUserCount() {
    return await this.usersService.getUserCount();
  }
}
