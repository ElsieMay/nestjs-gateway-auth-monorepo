import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../lib/common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../lib/common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../../lib/common/guards/roles.guard';
import { Roles } from '../../../../lib/common/decorators/roles.decorator';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';
import {
  ProfileResponseDto,
  AdminResponseDto,
} from '../../../../lib/core/src/users-domain/dto/response/profile-response.dto';

interface UserRequest {
  userId: string;
  email: string;
  username: string;
  roles: Role[];
}

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(
    @CurrentUser() user: UserRequest,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfile(user.userId);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin only endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns admin data',
    type: AdminResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAdminData(
    @CurrentUser() user: UserRequest,
  ): Promise<AdminResponseDto> {
    return this.profileService.getAdminData(user.userId);
  }
}
