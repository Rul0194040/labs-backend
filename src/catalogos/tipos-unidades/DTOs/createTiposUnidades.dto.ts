import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * @ignore
 */
export class createTiposUnidadesDTO {
  @ApiProperty({
    description: 'Nombre del tipo de unidad',
  })
  @IsString()
  nombre: string;
}
