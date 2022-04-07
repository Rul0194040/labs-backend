import { ApiProperty } from '@nestjs/swagger';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';
import { IsOptional } from 'class-validator';

export class CreateSucursalesInsumosDTO {
  @ApiProperty({
    description: 'id del insumo',
  })
  insumo: number;

  @ApiProperty({
    description: 'cantidad a agregar',
  })
  cantidad: number;

  @ApiProperty({
    description: 'id del lote',
  })
  @IsOptional()
  lote?: LoteEntity;
}
