import { ApiProperty } from '@nestjs/swagger';

export class DataResultDTO {
  // admin
  @ApiProperty()
  insumos?: number;

  @ApiProperty()
  servicios?: number;

  @ApiProperty()
  sucursales?: number;

  @ApiProperty()
  usuarios?: number;

  @ApiProperty()
  ventas?: number;

  //compras
  @ApiProperty()
  minimosSucursal?: number;

  @ApiProperty()
  cantidadProveedores?: number;

  @ApiProperty()
  ordenesCompras?: number;

  @ApiProperty()
  presupuestos?: number;

  //almacen general
  @ApiProperty()
  requisicionesMatriz?: number;

  @ApiProperty()
  minimosMatriz?: number;

  @ApiProperty()
  movimientosTransito?: number;

  //sucursal
  @ApiProperty()
  requisicionesPedidas?: number;

  @ApiProperty()
  transferenciasRecibidas?: number;

  @ApiProperty()
  altas?: number;

  @ApiProperty()
  insumosSucursal?: number;

  // ventas
  @ApiProperty()
  clientes?: number;

  @ApiProperty()
  pacientes?: number;

  // tesorero
  @ApiProperty()
  ventasExcedidas?: number;
}
