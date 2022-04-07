import { FaltanteDTO } from './cortesTesorero/faltante.dto';
import {
  Controller,
  Get,
  Put,
  UseGuards,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
import { TesorerosService } from './tesoreros.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { ProfileTypes } from '../users/profiles.enum';
import { VentaEntity } from '../ventas/ventas.entity';
import { VentasService } from '../ventas/ventas.service';
import { UpdateResult } from 'typeorm';
import { EstadosCancelacionVenta } from '@sanfrancisco/ventas/estadosCancelacion.enum';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { UsersEntity } from '../users/users.entity';
import { MovimientoCajaEntity } from '@sanfrancisco/cajas/movimientos-caja.entity';
import { EstatusMovimientoCancelacionE } from '../cajas/estatusMovimiento.enum';
import { CajasService } from '../cajas/cajas.service';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '../common/DTO/pagination-prime-Ng-result.dto';

@Controller('tesoreros')
@UseGuards(JwtAuthGuard)
@RequireProfiles(
  ProfileTypes.TESORERO_SUCURSALES_CENTRALES,
  ProfileTypes.TESORERO_SUCURSALES_FORANEAS,
)
export class TesorerosController {
  constructor(
    private readonly tesorerosService: TesorerosService,
    private readonly ventasService: VentasService,
    private readonly cajasService: CajasService,
  ) {}

  /**
   * Vizualiza todas las solicitudes de cancelacion existentes
   *
   * @returns {VentaEntity[]}
   */
  @Get('solicitudes-cancelacion')
  @RequireRule('view:ventas')
  verSolicitudesCancelacion(): Promise<VentaEntity[]> {
    return this.tesorerosService.verSolicitudesCancelacion();
  }

  /**
   * Vizualiza todas las ventas canceladas
   *
   * @returns {VentaEntity[]}
   */
  @Get('ventas/canceladas')
  @RequireRule('view:ventas')
  verVentasCanceladas(): Promise<VentaEntity[]> {
    return this.tesorerosService.verVentasCanceladas();
  }

  /**
   *
   * @param ventaId id de la venta
   * @param estatusCancelacion estatus de cancelacion - aceptada / rechazada
   * @returns {UpdateResult}
   */
  @Put('cancelar/:ventaId')
  @RequireRule('update:ventas')
  cancelarVenta(
    @Param('ventaId', ParseIntPipe) ventaId: number,
    @Body('estatusCancelacion') estatusCancelacion: EstadosCancelacionVenta,
    @User() user: UsersEntity,
  ): Promise<UpdateResult> {
    return this.ventasService.cancelarVenta(ventaId, estatusCancelacion, user);
  }

  /**
   * visualiza las cajas abiertas de las sucursales
   *
   * @param user usuario tesorero en sesion
   * @returns {CajaEntity[]}
   */
  @Post('cajas/activas')
  @RequireRule('view:cajas')
  obtenerCajasActivas(
    @User() user: LoginIdentityDTO,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.tesorerosService.obtenerCajasAbiertas(user, options);
  }

  /**
   * visualizar solicitudes de cancelacion movimientos
   *
   * @returns {MovimientoCajaEntity[]}
   */
  @Get('cajas/movimientos-solicitudes')
  @RequireRule('view:cajas')
  movimientosSolicitudCancelacion(): Promise<MovimientoCajaEntity[]> {
    return this.tesorerosService.movimientosSolicitudCancelacion();
  }

  /**
   * Acepta o rechaza una cancelacion
   *
   * @param movimientoId id del movimiento
   * @param estatusCancelacion estatus de cancelacion - aceptada / rechazada
   * @returns {UpdateResult}
   */
  @Put('movimiento/cancelar/:movimientoId')
  @RequireRule('update:cajas')
  cancelarMovimiento(
    @Param('movimientoId', ParseIntPipe) movimientoId: number,
    @Body('estatusCancelacion')
    estatusCancelacion: EstatusMovimientoCancelacionE,
  ): Promise<CajaEntity> {
    return this.cajasService.cancelarMovimiento(
      movimientoId,
      estatusCancelacion,
    );
  }

  /**
   * Pagina los insumos
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns insumos paginados
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.tesorerosService.paginate(options);
  }

  /**
   * Finalizar corte de tesorero
   *
   * @param corteId id del corte
   * @returns {UpdateResult}
   */
  @Patch('finalizar-corte/:corteId')
  finalizarCorte(
    @Param('corteId', ParseIntPipe) corteId: number,
  ): Promise<UpdateResult> {
    return this.tesorerosService.finalizarCorte(corteId);
  }

  /**
   * actualizar el faltante y las observaciones del tesorero
   *
   * @param cajaId id de la caja
   * @returns {UpdateResult}
   */
  @Patch('faltante-caja/:cajaId')
  patchFaltante(
    @Param('cajaId', ParseIntPipe) cajaId: number,
    @Body() data: FaltanteDTO,
  ): Promise<UpdateResult> {
    return this.tesorerosService.setObservaciones(cajaId, data);
  }
}
