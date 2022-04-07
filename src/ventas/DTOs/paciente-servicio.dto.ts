import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
/**
 * Para agregar un paciente a un servicio de una venta(la venta debe estar en borrador o proceso).
 */
export class PacienteServicioDTO {
  @ApiProperty()
  ventaId: number;

  @ApiProperty()
  @IsOptional()
  pacienteId: number;
}
