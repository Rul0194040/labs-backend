import { PaginationOptions } from './../../common/DTO/paginationPrimeNg.dto';
import { ApiProperty } from '@nestjs/swagger';
export class RequisicionBySucursalDTO {
  @ApiProperty()
  options: PaginationOptions;
  @ApiProperty()
  sucursal: number;
}
