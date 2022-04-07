import { RecibirDTO } from './DTO/recibirDatos.dto';
import { PaginateMovimientosCajaDTO } from './DTO/paginate-movimientos-caja.dto';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CajaEntity } from './cajas.entity';
import { CajasService } from './cajas.service';
import { CreateCajaDTO } from './DTO/create-caja.dto';
import { UpdateCajaDTO } from './DTO/update-caja.dto';
import { MovimientosCajaDTO } from './DTO/movimientos-caja.dto';
import { TotalMovimientosCajaDTO } from './DTO/total-movimientos-caja.dto';
import { CerrarCajaDTO } from './DTO/cerrar-caja.dto';
import { ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { Response } from 'express';
import { CambiarStatusMovimientoDTO } from './DTO/cambiarStatusMovimiento.dto';
import { MovimientoCajaEntity } from './movimientos-caja.entity';
import { CajasCerradasSucursalDTO } from './DTO/cajasCerradasSucursal.dto';

@ApiTags('cajas')
@Controller('cajas')
@UseGuards(JwtAuthGuard)
export class CajasController {
  constructor(
    private readonly cajasService: CajasService,
    private readonly heimalService: HeimdalService,
  ) {}

  @Post()
  @RequireRule('create:caja')
  create(
    @Body() caja: CreateCajaDTO,
    @User() user: UsersEntity,
  ): Promise<CajaEntity> {
    return this.cajasService.create(caja, user);
  }

  @Post('paginate')
  @RequireRule('view:cajas')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.cajasService.paginate(options);
  }

  @Post('paginate/movimientos-caja/:id')
  @RequireRule('view:cajas')
  paginatemovCaja(
    @Param('id', ParseIntPipe) id: number,
    @Body() options: PaginateMovimientosCajaDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.cajasService.movimientosCaja(
      id,
      options.movimiento,
      options.options,
    );
  }

  @Get('movimientos-cancelados/:id')
  @RequireRule('view:cajas')
  cancelacionesCaja(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovimientoCajaEntity[]> {
    return this.cajasService.movimientosCancelados(id);
  }

  @Get('movimientos-retiros/:id')
  @RequireRule('view:cajas')
  retirosCaja(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovimientoCajaEntity[]> {
    return this.cajasService.movimientosRetiros(id);
  }

  @Get('movimientos-depositos/:id')
  @RequireRule('view:cajas')
  depositosCaja(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovimientoCajaEntity[]> {
    return this.cajasService.movimientosDepositos(id);
  }

  @Post('cancelar-movimiento/:idMovimiento/caja/:idCaja')
  @RequireRule('update:cajas')
  solicitarCancelacion(
    @Param('idMovimiento', ParseIntPipe) idMovimiento: number,
    @Param('idCaja', ParseIntPipe) idCaja: number,
    @Body() cambiarStatus: CambiarStatusMovimientoDTO,
  ): Promise<MovimientoCajaEntity> {
    return this.cajasService.solicitarCancelacion(
      idMovimiento,
      idCaja,
      cambiarStatus,
    );
  }

  @Post('paginate/cajas-usuario')
  @RequireRule('view:cajas')
  paginateUserCaja(
    @Body() options: PaginationOptions,
    @User() user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.cajasService.cajasUsuario(user, options);
  }

  @Post('paginate/ventas-caja')
  @RequireRule('view:cajas')
  paginateventasCaja(
    @User() user: LoginIdentityDTO,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.cajasService.ventasCaja(user, options);
  }

  @Get(':id')
  @RequireRule('view:cajas')
  getById(@Param('id', ParseIntPipe) id: number): Promise<CajaEntity> {
    return this.cajasService.getById(id);
  }

  @Put(':id')
  @RequireRule('update:cajas')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() caja: UpdateCajaDTO,
  ): Promise<UpdateResult> {
    return this.cajasService.update(id, caja);
  }

  @Put('setEntrega/:id')
  @RequireRule('update:cajas')
  updateEntregada(
    @Param('id', ParseIntPipe) id: number,
    @Body() datosCaja: RecibirDTO,
  ): Promise<UpdateResult> {
    return this.cajasService.setEntregada(id, datosCaja);
  }

  @Put('setContabilizada/:id')
  @RequireRule('update:cajas')
  updateContabilizada(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateResult> {
    return this.cajasService.setContabilizada(id);
  }

  @Delete(':id')
  @RequireRule('delete:cajas')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.cajasService.delete(id);
  }

  /**
   * Retorna el estado de una caja por usuario en sesión
   *
   * @param user Usuario en sesión
   * @returns {CajaEntity | null} resultados
   */
  @Get('consultar/estatus')
  @RequireRule('view:cajas')
  consultarCaja(@User() user: LoginIdentityDTO): Promise<CajaEntity | null> {
    return this.cajasService.consultarCajaUsuario(user);
  }

  /**
   * Crea un deposito en caja
   *
   * @param user usuario en sesion
   * @param depositoData datos del deposito
   * @returns {CajaEntity} detalle del movimiento
   */
  @Post('deposito')
  @RequireRule('create:caja')
  crearDeposito(
    @User() user: UsersEntity,
    @Body() depositoData: MovimientosCajaDTO,
  ): Promise<CajaEntity> {
    return this.cajasService.crearDeposito(user, depositoData, false);
  }

  /**
   * Crea un retiro en caja
   *
   * @param user usuario en sesion
   * @param depositoData datos del retiro
   * @returns {CajaEntity} detalle del movimiento
   */
  @Post('retiro')
  @RequireRule('create:caja')
  crearRetiro(
    @User() user: UsersEntity,
    @Body() depositoData: MovimientosCajaDTO,
  ): Promise<CajaEntity> {
    return this.cajasService.crearRetiro(user, depositoData);
  }

  /**
   * obtiene el total de movimientos por caja abierta
   *
   * @param user usuario en sesión
   * @returns { TotalMovimientosCajaDTO } total de movimientos
   */
  @Get('total/movimientos')
  getTotalMovimientosByCaja(
    @User() user: UsersEntity,
  ): Promise<TotalMovimientosCajaDTO> {
    return this.cajasService.getTotalMovimientosByCaja(user);
  }

  /**
   * obtiene info de las cajas cerradas de una sucursal
   * que aun no esten contabilizadas
   *
   * @param sucursalId id de la sucursal
   * @returns {CajasCerradasSucursalDTO}
   */
  @Get('cerradas/sucursal/:sucursalId')
  getCajasCerradasPorSucursal(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @User() user: LoginIdentityDTO,
  ): Promise<CajasCerradasSucursalDTO[]> {
    return this.cajasService.getCajasCerradasPorSucursal(sucursalId, user);
  }

  /**
   * obtiene info de un corte por el id de la caja
   * @param cajaId id de la caja
   * @returns {CajasCerradasSucursalDTO}
   */
  @Get('corte/caja/:cajaId')
  getCortePorCaja(
    @Param('cajaId') cajaId: number,
  ): Promise<CajasCerradasSucursalDTO> {
    return this.cajasService.getCortePorCaja(cajaId);
  }

  /**
   * actualiza las cajas cerradas a contabilizadas de una sucursal
   *
   * @param sucursalId id sucursal
   * @returns {}
   */
  @Put('generar/arqueo/cajas-cerradas/:sucursalId')
  contabilizarCajas(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @User() user: LoginIdentityDTO,
  ): Promise<UpdateResult> {
    return this.cajasService.contabilizarCajas(sucursalId, user);
  }

  /**
   * Proceso de cerrar una caja
   *
   * @param user Usuario en sesión que pertenece a una caja
   * @param caja datos del cierre de caja
   * @returns {UpdateResult} resultado de la actualizacion
   */
  @Put('cerrar/caja')
  cerrarCaja(
    @User() user: LoginIdentityDTO,
    @Body() caja: CerrarCajaDTO,
  ): Promise<UpdateResult> {
    return this.cajasService.cerrarCaja(user, caja);
  }

  /**
   * Imprimir el arqueo de una caja
   *
   * @param id id de la caja a imprimir el arqueo
   */
  @Post('generar/arqueo')
  @HttpCode(HttpStatus.CREATED)
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  @Header('Content-Disposition', 'attachment; filename=arqueo.docx')
  async arqueo(@Res() res: Response, @Body('id', ParseIntPipe) id: number) {
    const depositos: MovimientoCajaEntity[] =
      await this.cajasService.movimientosDepositos(id);
    const retiros: MovimientoCajaEntity[] =
      await this.cajasService.movimientosRetiros(id);
    depositos.forEach((element: any) => {
      element.createdAt = moment(element.createdAt).format(
        'DD/MM/YYYY [a las] HH:mm:ss',
      );
    });
    retiros.forEach((element: any) => {
      element.createdAt = moment(element.createdAt).format(
        'DD/MM/YYYY [a las] HH:mm:ss',
      );
    });

    const cajaInfo = await this.cajasService.getInfoForDoc(id);
    cajaInfo.caja.fechaApertura = moment(cajaInfo.caja.fechaApertura).format(
      'DD/MM/YYYY [a las] HH:mm:ss',
    );
    cajaInfo.caja.fechaCierre = moment(cajaInfo.caja.fechaCierre).format(
      'DD/MM/YYYY [a las] HH:mm:ss',
    );
    //generar buffer del docx parseado con data
    const bufferDoc = await this.heimalService.render('reportes/caja/arqueo', {
      fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
      nameSucursal: cajaInfo.sucursal.nombre,
      nameUsuario: `${cajaInfo.usuario.firstName} ${cajaInfo.usuario.lastName}`,
      caja: cajaInfo.caja,
      movimientos: cajaInfo.dataResult,
      depositos: depositos,
      retiros: retiros,
    });

    //preparar headers de salida
    res.set({
      'Content-Length': bufferDoc.length,
    });

    //retornar buffer en respuesta
    res.end(bufferDoc);
  }
}
