import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailResultadosDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}
