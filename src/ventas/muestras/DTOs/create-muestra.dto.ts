import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateMuestraDTO {
  @ApiProperty()
  ventaDetalleId: number;

  @ApiProperty()
  @IsOptional()
  notas?: string;
}
