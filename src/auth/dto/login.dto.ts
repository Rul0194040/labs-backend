import { ApiProperty } from '@nestjs/swagger';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
/**
 * @ignore
 */
export class LoginDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  sucursalId: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  rememberme: boolean;

  @ApiProperty()
  @IsOptional()
  device: any;

  @ApiProperty()
  @IsOptional()
  scope: ProfileTypes;
}
