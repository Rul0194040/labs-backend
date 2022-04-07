import { ApiProperty } from '@nestjs/swagger';
export class GenerarOrdenDTO {
  @ApiProperty({
    description: '',
  })
  presupuestoId: number;
}
