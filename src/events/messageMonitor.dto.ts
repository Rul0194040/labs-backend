import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * @ignore
 */
export class WSMessageMonitorBodyDTO {
  @ApiProperty()
  @IsString()
  ApiKey: string;

  @ApiProperty()
  @IsString()
  data: any;
}
