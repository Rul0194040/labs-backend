import { ApiProperty } from '@nestjs/swagger';
export class AgregarInsumoDTO {
  @ApiProperty()
  insumoId: number;

  @ApiProperty()
  tipoUnidadId: number;

  @ApiProperty()
  cantidad: number;

  @ApiProperty()
  precio: number;

  @ApiProperty()
  descuento: number;
}
