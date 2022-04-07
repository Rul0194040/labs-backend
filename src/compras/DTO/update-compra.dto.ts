import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateCompraDTO } from './compra.dto';
import { DetalleCompraDTO } from './detalle-compra.dto';
export class UpdateCompraDTO {
  @ApiProperty()
  @IsOptional()
  compra?: CreateCompraDTO;

  @ApiProperty()
  @IsOptional()
  detalle?: DetalleCompraDTO[];
}
