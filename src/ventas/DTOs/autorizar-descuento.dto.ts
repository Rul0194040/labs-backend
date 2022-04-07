import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class AutorizarDescuentoDTO {
  @ApiProperty()
  nip: string;

  @ApiProperty()
  maxDescuento: number;

  @ApiProperty()
  @IsOptional()
  notaDescuento?: string;
}

export class AutorizarDescuentoResponseDTO {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  maxDescuento?: number;

  @ApiProperty()
  modificado: boolean;
}
