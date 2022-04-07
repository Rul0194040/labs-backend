import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsString } from 'class-validator';
/**
 * @ignore
 */
export class WSMessageBodyDTO {
  @ApiProperty()
  @IsString()
  @Contains('Bearer ')
  Authorization: string;

  @ApiProperty()
  @IsString()
  data: any;
}
