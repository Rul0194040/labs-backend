import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * DTO para usuarios
 */
export class UpdateGrupoServiciosDTO {
  @ApiProperty({
    description: 'Nombre del grupo',
  })
  @IsString()
  nombre: string;
}
