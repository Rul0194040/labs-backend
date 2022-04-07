import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ZonaEnum } from '../zona.enum';
/**
 * @ignore
 */
export class CreateSucursalDTO {
  @ApiProperty({
    description: 'Nombre de la sucursal',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Nombre del primer apikey de la sucursal',
  })
  @IsString()
  @MinLength(5)
  apiKey: string;

  @ApiProperty({
    description: 'Descripción de la sucursal',
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    description: 'Valor que nos permite saber si es matriz o no',
  })
  @IsBoolean()
  esMatriz: boolean;

  @ApiProperty({
    description: 'Telefono de la sucursal',
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    description: 'responsable de la sucursal',
  })
  @IsOptional()
  @IsNumber()
  responsableId?: number;

  @ApiProperty({
    description: 'Indica si la sucursal puede hacer requisiciones o no',
  })
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
  @IsOptional()
  @IsBoolean()
  seleccionarZona?: boolean;

  @ApiProperty()
  @IsOptional()
  userResponsable?: UsersEntity;
}
