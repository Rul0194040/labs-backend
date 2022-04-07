import { ApiProperty } from '@nestjs/swagger';
/**
 * @ignore
 */
export class SendMailDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  email: string;
}
