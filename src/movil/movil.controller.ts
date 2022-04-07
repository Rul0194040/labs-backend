import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { SucursalesInsumosService } from '../sucursales/services/sucursalesInsumos.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { ApiTags } from '@nestjs/swagger';
import { MovilService } from './movil.service';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { CajasService } from '@sanfrancisco/cajas/cajas.service';
import { EstadosVentas } from '@sanfrancisco/ventas/estadosVentas.enum';

@ApiTags('movil')
@Controller('movil')
@UseGuards(JwtAuthGuard)
export class MovilController {
  constructor(
    private readonly sucursalesInsumosService: SucursalesInsumosService,
    private readonly movilService: MovilService,
    private readonly cajasService: CajasService,
  ) {}

  @Get('cajas/:id/detalle')
  @RequireRule('view:cajas')
  getById(@Param('id', ParseIntPipe) id: number): Promise<CajaEntity> {
    return this.cajasService.getById(id);
  }

  /**
   * Busca insumos por sucursal y los pagina
   *
   * @param idSucursal id de la sucursal
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  @Post('sucursal/:idSucursal/insumos/paginate')
  @RequireRule('view:sucursales')
  paginateInsumosBySucursal(
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.sucursalesInsumosService.paginateInsumosBySucursal(
      idSucursal,
      options,
    );
  }

  /**
   * visualiza las cajas abiertas de las sucursales
   *
   * @returns {CajaEntity[]}
   */
  @Get('cajas/abiertas')
  @RequireRule('view:cajas')
  obtenerCajasActivas(): Promise<CajaEntity[]> {
    return this.movilService.obtenerCajasAbiertas();
  }
}
