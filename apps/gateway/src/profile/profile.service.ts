import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ProfileResponseDto,
  AdminResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/profile-response.dto';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

@Injectable()
export class ProfileService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
      createdAt: Date;
    } = await firstValueFrom(
      this.userClient.send('find_user_by_id', { id: userId }),
    );

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles as Role[],
      createdAt: user.createdAt,
      message: 'User profile retrieved successfully',
      user: {
        userId: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles as Role[],
        createdAt: user.createdAt,
      },
    };
  }

  async getAdminData(userId: string): Promise<AdminResponseDto> {
    const totalUsers = await this.getUserCount();
    const activeUsers = await this.getActiveUserCount();

    return {
      message: 'This is an admin-only route',
      userId: userId,
      adminData: {
        totalUsers,
        activeUsers,
      },
    };
  }

  private async getUserCount(): Promise<number> {
    return await firstValueFrom(
      this.userClient.send<number>('get_user_count', {}),
    );
  }

  private async getActiveUserCount(): Promise<number> {
    const stats = await firstValueFrom(
      this.userClient.send<{ activeUsers: number }>('get_user_stats', {}),
    );
    return stats.activeUsers;
  }
}
