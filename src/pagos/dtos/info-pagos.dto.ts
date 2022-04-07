import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TiposPago } from '../tipoPagos.enum';

export class InfoPagosDTO {
  @ApiProperty()
  @IsNumber()
  monto: number;

  @ApiProperty()
  @IsEnum(TiposPago)
  tipo: TiposPago;

  @ApiProperty()
  @IsOptional()
  referencia: string;

  @ApiProperty()
  @IsOptional()
  notas?: string;

  @ApiProperty()
  @IsOptional()
  efectivoRecibido?: number;

  @ApiProperty()
  @IsOptional()
  cambio?: number;

  @ApiProperty()
  @IsOptional()
  cobranza?: boolean;
}
