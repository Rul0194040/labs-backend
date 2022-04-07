import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * @ignore
 */
export class UpdateTiposUnidadesDTO {
  @ApiProperty({
    description: 'Nombre del tipo de unidad',
  })
  @IsString()
  nombre: string;
}
