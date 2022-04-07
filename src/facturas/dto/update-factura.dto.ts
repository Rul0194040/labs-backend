import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class UpdateFacturaDTO {
  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  telefono?: string;

  @ApiProperty()
  @IsOptional()
  numInt?: string;

  @ApiProperty()
  @IsOptional()
  numExt?: string;

  @ApiProperty()
  @IsOptional()
  colonia?: string;

  @ApiProperty()
  @IsOptional()
  calle?: string;
}
