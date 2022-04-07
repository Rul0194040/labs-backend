import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { SucursalesService } from './services/sucursales.service';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RateLimit } from 'nestjs-rate-limiter';

@ApiTags('public/sucursales')
@Controller('public/sucursales')
export class SucursalesPublicController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  /**
   * Pagina las sucursales
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate')
  @RateLimit({
    keyPrefix: 'public/sucursales/paginate',
    points: 10,
    duration: 60,
    errorMessage: 'Límite de solicitudes excedido.',
  })
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.sucursalesService.paginate(options);
  }
}
