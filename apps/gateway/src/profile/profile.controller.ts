import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../lib/common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../lib/common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

interface UserRequest {
  userId: string;
  email: string;
  username: string;
}

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: UserRequest) {
    return {
      message: 'This is a protected route',
      user,
    };
  }
}
