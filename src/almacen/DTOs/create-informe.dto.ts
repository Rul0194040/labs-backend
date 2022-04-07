import { ApiProperty } from '@nestjs/swagger';
import { DetalleMovimientosEntity } from '../detalleMovimientos.entity';
export class CreateInformeDTO {
  @ApiProperty()
  movimiento: any; // MovimientosAlmacenEntity quedo en eny por que se hace leftjoin a sucOrigen y destino
  @ApiProperty()
  detalle: DetalleMovimientosEntity[];
}
