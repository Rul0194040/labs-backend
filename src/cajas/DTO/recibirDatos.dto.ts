import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OrigenEntrega } from './origenEntrega.dto';
export class RecibirDTO {
  @ApiProperty()
  entregaOrigen: OrigenEntrega;
  @ApiProperty()
  @IsOptional()
  referencia?: string;
  @ApiProperty()
  @IsOptional()
  recibio?: string;
}
