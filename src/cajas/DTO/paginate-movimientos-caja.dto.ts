import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { ApiProperty } from '@nestjs/swagger';
export class PaginateMovimientosCajaDTO {
  @ApiProperty()
  options: PaginationOptions;

  @ApiProperty()
  movimiento: string;
}
