import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
/**
 * PaginationOptions
 */
export class PaginationOptions {
  /**
   * @ignore
   */
  @ApiProperty()
  sort: any;

  @ApiProperty()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  direction?: 'ASC' | 'DESC';

  /**
   * @ignore
   */
  @ApiProperty({
    description: 'Resultados que la paginacion se saltara',
    default: 0,
  })
  skip: number;
  /**
   * @ignore
   */
  @ApiProperty({
    description: 'Resultados que la paginacion mostrara',
    default: 10,
  })
  take: number;
  /**
   * @ignore
   */
  @ApiProperty()
  filters: {
    buscar?: string;
  };
}
