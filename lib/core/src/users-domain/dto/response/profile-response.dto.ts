import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../auth-domain/enums/roles.enum';

export class AdminDataDto {
  @ApiProperty({ example: 150 })
  totalUsers: number;

  @ApiProperty({ example: 120 })
  activeUsers: number;
}

export class ProfileResponseDto {
  @ApiProperty({ example: 'e4b2c1a8-3f5d-4c2e-9b1a-8d7c6e5f4a3b' })
  id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: [Role.USER], enum: Role, isArray: true })
  roles: Role[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 'message' })
  message: string;

  @ApiProperty({ type: Object })
  user: {
    userId: string;
    email: string;
    username: string;
    roles: Role[];
    createdAt: Date;
  };

  @ApiProperty({ type: AdminDataDto, required: false })
  adminData?: {
    totalUsers: number;
    activeUsers: number;
  };
}

export class AdminResponseDto {
  @ApiProperty({ example: 'This is an admin-only route' })
  message: string;

  @ApiProperty({ example: 'e4b2c1a8-3f5d-4c2e-9b1a-8d7c6e5f4a3b' })
  userId: string;

  @ApiProperty({ type: AdminDataDto })
  adminData: AdminDataDto;
}
