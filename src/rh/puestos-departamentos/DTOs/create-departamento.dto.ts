import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateDepartamentoDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  parentId?: number;
}
