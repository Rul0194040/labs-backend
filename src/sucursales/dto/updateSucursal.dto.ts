import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ZonaEnum } from '../zona.enum';
/**
 * DTO para usuarios
 */
export class UpdateSucursalDTO {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  descripcion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  calle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  numExt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  colonia: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cp: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  municipio: string;

  @ApiProperty()
  @IsBoolean()
  esMatriz: boolean;

  @ApiProperty()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsString()
  lng: string;

  @ApiProperty()
  @IsString()
  telefono?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  responsableId?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  puedeHacerRequisicion?: boolean;

  @IsBoolean()
  @IsOptional()
  esForanea?: boolean;

  @ApiProperty()
  @IsEnum(ZonaEnum)
  zona: ZonaEnum;

  @ApiProperty()
  @IsBoolean()
  seleccionarZona: boolean;

  @ApiProperty()
  @IsOptional()
  userResponsable?: UsersEntity;
}
