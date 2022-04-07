import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
/**
 * @ignore
 */
export class CreateTipoInsumoDTO {
  @ApiProperty({
    description: 'Nombre del tipo de insumo',
  })
  @IsString()
  nombre: string;
}
