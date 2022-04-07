import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * DTO para usuarios
 */
export class UpdateTipoMuestraDTO {
  @ApiProperty({
    description: 'Nombre del tipo de muestra',
  })
  @IsString()
  nombre: string;
}
