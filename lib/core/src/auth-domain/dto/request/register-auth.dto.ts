import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
