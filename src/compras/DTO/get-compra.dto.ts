import { ApiProperty } from '@nestjs/swagger';
import { CompraEntity } from '../compras.entity';
import { DetalleCompraEntity } from '../detallesCompras.entity';

export class GetCompraDTO {
  @ApiProperty()
  compra: CompraEntity;
  @ApiProperty()
  detalle: DetalleCompraEntity[];
}
