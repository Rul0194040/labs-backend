import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { InfoPagosDTO } from './info-pagos.dto';

export class AgregarPago {
  @ApiProperty()
  ventaId: number;

  @ApiProperty()
  descuento: number;

  @ApiProperty()
  descuentoPesos: number;

  @ApiProperty()
  pagos: InfoPagosDTO[];

  @ApiProperty()
  fechaHora: Date;

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
