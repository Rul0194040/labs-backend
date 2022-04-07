import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * @ignore
 */
export class CreateGrupoServiciosDTO {
  @ApiProperty({
    description: 'Nombre del grupo',
  })
  @IsString()
  nombre: string;
}
