import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { ValidatePasswordStrength } from '../../../../../common/utils/password.util';
import { SanitiseAndTrim } from '../../../../../common/decorators/sanitise.decorator';

export class RegisterDto {
  @IsEmail()
  @SanitiseAndTrim()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @SanitiseAndTrim()
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @IsString()
  @ValidatePasswordStrength({
    message: 'Password is not strong enough',
  })
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
