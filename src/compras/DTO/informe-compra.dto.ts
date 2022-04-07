import { DetalleCompraDTO } from './detalle-compra.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCompraDTO } from './compra.dto';
export class InformeCompraDTO {
  // EstatusCompra por defaul debe ser BORRADOR
  @ApiProperty()
  compra: CreateCompraDTO;

  @ApiProperty()
  detalle: DetalleCompraDTO[];
}
