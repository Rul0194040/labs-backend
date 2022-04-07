import { ApiProperty } from '@nestjs/swagger';
import { CreatePresupuestoDetalleDTO } from './create-presupuesto-detalle.dto';
export class CreatePresupuestoDTO {
  @ApiProperty()
  detalle: CreatePresupuestoDetalleDTO[];
  //Al crear un presupuesto, se va a recibir un arreglo de obj
  //1 Se crear el presupuesto con una fecha (moment) y un estatus = BORRADOR
  //2 Se crea n registros en presupuesto detalle[](proviene del front)
  /**Ejemplo
   detalle:[
     {
       insumoId,
     }
   ]
   */
}
