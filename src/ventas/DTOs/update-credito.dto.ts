import { ApiProperty } from '@nestjs/swagger';

export class UpdateCreditoDTO {
  @ApiProperty()
  credito: boolean;

  @ApiProperty()
  diasCredito: number;

  @ApiProperty()
  descuento?: number;

  @ApiProperty()
  descuentoPesos?: number;
}
