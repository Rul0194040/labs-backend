import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProveedorDTO {
  @ApiProperty({
    description: 'telefono del proveedor',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    description: 'descripcion del proveedor',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'direccion del proveedor',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'contacto',
  })
  @IsOptional()
  @IsString()
  contacto?: string;
}
