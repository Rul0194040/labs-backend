import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginEmailDataDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}
