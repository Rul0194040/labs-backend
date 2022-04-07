import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CerrarCajaDTO {
  @ApiProperty()
  @IsOptional()
  mxn05?: number;

  @ApiProperty()
  @IsOptional()
  mxn1?: number;

  @ApiProperty()
  @IsOptional()
  mxn2?: number;

  @ApiProperty()
  @IsOptional()
  mxn5?: number;

  @ApiProperty()
  @IsOptional()
  mxn10?: number;

  @ApiProperty()
  @IsOptional()
  mxn20?: number;

  @ApiProperty()
  @IsOptional()
  mxn50?: number;

  @ApiProperty()
  @IsOptional()
  mxn100?: number;

  @ApiProperty()
  @IsOptional()
  mxn200?: number;

  @ApiProperty()
  @IsOptional()
  mxn500?: number;

  @ApiProperty()
  @IsOptional()
  mxn1000?: number;

  @ApiProperty()
  @IsOptional()
  arqTransferencia?: number;

  @ApiProperty()
  @IsOptional()
  arqTarjeta?: number;

  @ApiProperty()
  @IsOptional()
  arqCheque?: number;

  @ApiProperty()
  @IsOptional()
  arqCredito?: number;

  @ApiProperty()
  @IsOptional()
  totalArqueo?: number;

  @ApiProperty()
  @IsOptional()
  notasArqueo?: string;
}
