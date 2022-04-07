import { ZonaEnum } from './../../sucursales/zona.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { TipoPrecio } from '../tipoPrecio.enum';
/**
 * Al crear una venta, puede ser que no tenga cliente (publico en general)
 */
export class CreateVentaDTO {
  @ApiProperty()
  @IsOptional()
  pacienteId?: number;

  @ApiProperty()
  @IsOptional()
  medicoId?: number;

  @ApiProperty()
  zona: ZonaEnum;

  @ApiProperty()
  @IsOptional()
  fechaUltimaRegla: Date;

  @ApiProperty()
  @IsOptional()
  observaciones: string;

  @ApiProperty()
  @IsOptional()
  diagnostico: string;

  @ApiProperty()
  tipoPrecio: TipoPrecio;
}
