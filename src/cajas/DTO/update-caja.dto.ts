import { ApiProperty } from '@nestjs/swagger';
export class UpdateCajaDTO {
  @ApiProperty({
    description: 'fecha de apertura',
  })
  fechaApertura: Date;

  @ApiProperty({
    description: 'fecha de cierre',
  })
  fechaCierre: Date;

  @ApiProperty({
    description: 'total del efectivo',
  })
  totalEfecivo: number;

  @ApiProperty({
    description: 'total del efectivo proveniente de las tarjetas',
  })
  totalTarjeta: number;

  @ApiProperty({
    description: 'total del efectivo proveniente de los cheques',
  })
  totalCheque: number;

  @ApiProperty({
    description: 'total del efectivo proveniente de las tranferencias',
  })
  totalTransferencia: number;

  @ApiProperty({
    description: 'total de cancelaciones',
  })
  totalCancelaciones: number;

  @ApiProperty({
    description: 'notas de caja',
  })
  notas?: string;
}
