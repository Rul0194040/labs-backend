import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * @ignore
 */
export class CreateTipoMuestraDTO {
  @ApiProperty({
    description: 'Nombre del tipo de muestra',
  })
  @IsString()
  nombre: string;
}
