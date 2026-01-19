import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../auth-domain/enums/roles.enum';
import { User } from '../../entities/user.entity';
import { IsEmail, IsString } from 'class-validator';

export class UserResponseDto {
  @IsString()
  @ApiProperty({ example: 'e4b2c1a8-3f5d-4c2e-9b1a-8d7c6e5f4a3b' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: [Role.USER], enum: Role, isArray: true })
  roles: Role[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static fromEntityArray(users: User[]): UserResponseDto[] {
    return users.map((user) => this.fromEntity(user));
  }
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];

  @ApiProperty({ example: 150 })
  total: number;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'User deleted successfully' })
  message: string;
}
