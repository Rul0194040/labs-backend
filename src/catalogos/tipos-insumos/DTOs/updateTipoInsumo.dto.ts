import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * DTO para usuarios
 */
export class UpdateTipoInsumoDTO {
  @ApiProperty({
    description: 'Nombre del tipo de insumo',
  })
  @IsString()
  nombre: string;
}
