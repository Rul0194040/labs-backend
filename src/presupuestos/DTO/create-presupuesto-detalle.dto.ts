import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class CreatePresupuestoDetalleDTO {
  @ApiProperty()
  insumoId: number;

  @ApiProperty()
  @IsOptional()
  cantidad: number;

  @ApiProperty()
  @IsOptional()
  tipoUnidadId: number;
}
