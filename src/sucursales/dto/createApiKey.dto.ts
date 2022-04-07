import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateApiKeyDTO {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  nombre: string;
}
