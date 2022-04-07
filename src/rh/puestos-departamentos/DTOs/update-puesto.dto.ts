import { ApiProperty } from '@nestjs/swagger';

export class UpdatePuestoDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  sueldoMensual: number;

  @ApiProperty()
  plazasDisponibles: number;
}
