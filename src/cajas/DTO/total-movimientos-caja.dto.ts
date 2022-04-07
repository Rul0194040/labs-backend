import { ApiProperty } from '@nestjs/swagger';
export class TotalMovimientosCajaDTO {
  @ApiProperty({
    description: 'total en depositos en una caja',
  })
  depositos?: number;

  @ApiProperty({
    description: 'total en retiros en una caja',
  })
  retiros?: number;

  @ApiProperty({
    description: 'total de ventas en una caja',
  })
  ventas?: number;

  @ApiProperty({
    description: 'total de cancelaciones en una caja',
  })
  cancelaciones?: number;

  @ApiProperty({
    description: 'total de cobros con transferencias en una caja',
  })
  transferencias?: number;

  @ApiProperty({
    description: 'total de cobros con tarjeta en una caja',
  })
  tarjeta?: number;

  @ApiProperty({
    description: 'total de cobros con efectivo en una caja',
  })
  efectivo?: number;

  @ApiProperty({
    description: 'total de cobros con cheque en una caja',
  })
  cheque?: number;

  @ApiProperty({
    description: 'total de cobros a credito en una caja',
  })
  credito?: number;

  @ApiProperty()
  creditoVentas?: number;
}
