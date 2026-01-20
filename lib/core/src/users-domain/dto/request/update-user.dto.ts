import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SanitiseAndTrim } from '../../../../../common/decorators/sanitise.decorator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john_doe' })
  @IsOptional()
  @IsString()
  @SanitiseAndTrim()
  username?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  @SanitiseAndTrim()
  email?: string;
}

export class UpdatePasswordDto {
  @ApiPropertyOptional({ example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
