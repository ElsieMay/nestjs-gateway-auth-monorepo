import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import {
  ProfileResponseDto,
  AdminResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/profile-response.dto';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProfileService.name);
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    this.logger.info({ userId }, 'Retrieving user profile');
    const user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
      createdAt: Date;
    } = await firstValueFrom(
      this.userClient.send('find_user_by_id', { id: userId }),
    );

    this.logger.info({ userId }, 'User profile retrieved successfully');

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
    this.logger.info({ userId }, 'Retrieving admin data');
    const totalUsers = await this.getUserCount();
    const activeUsers = await this.getActiveUserCount();

    this.logger.info(
      { userId, totalUsers, activeUsers },
      'Admin data retrieved successfully',
    );

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
    this.logger.info('Getting user count');
    const count = await firstValueFrom(
      this.userClient.send<number>('get_user_count', {}),
    );
    this.logger.info({ count }, 'User count retrieved');
    return count;
  }

  private async getActiveUserCount(): Promise<number> {
    this.logger.info('Getting active user count');
    const stats = await firstValueFrom(
      this.userClient.send<{ activeUsers: number }>('get_user_stats', {}),
    );
    this.logger.info(
      { activeUsers: stats.activeUsers },
      'Active user count retrieved',
    );
    return stats.activeUsers;
  }
}
