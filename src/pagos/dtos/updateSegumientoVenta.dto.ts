import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class updateSeguimientoVenta {
  @ApiProperty()
  @IsOptional()
  fechaUltimaRegla?: Date;

  @ApiProperty()
  @IsOptional()
  observaciones?: string;

  @ApiProperty()
  @IsOptional()
  diagnostico?: string;
}
