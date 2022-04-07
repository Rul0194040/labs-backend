import { RequisicionBySucursalDTO } from './DTOs/paginate-requisicion-sucursal.dto';
import { CreateInformeDTO } from './DTOs/create-informe.dto';
import { AlmacenService } from './almacen.service';
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
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateMovimientoDTO } from './DTOs/update-movimiento.dto';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import * as moment from 'moment';

@ApiTags('almacen')
@Controller('almacen')
@UseGuards(JwtAuthGuard)
export class AlmacenController {
  constructor(
    private readonly almacenService: AlmacenService,
    private readonly heimalService: HeimdalService,
  ) {}

  @Post()
  create(
    @Body() data: any,
    @User() user: LoginIdentityDTO,
  ): Promise<CreateInformeDTO> {
    return this.almacenService.create(data.movimiento, data.detalle, user);
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
    return this.almacenService.paginate(options);
  }

  /**
   * Pagina los movimientos de tipo requisicion
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns movimientos paginados
   */
  @Post('paginate/requisicion')
  paginateRequisicion(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.paginateRequisicion(options);
  }

  /**
   * Pagina los movimientos de tipo requisicion por sucursal
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns movimientos paginados
   */
  @Post('paginate/requisicion-sucursal')
  paginateRequisicionbySucursal(
    @Body() data: RequisicionBySucursalDTO,
    @User() user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.paginateRequisicionbySucursal(
      data.options,
      data.sucursal,
      user,
    );
  }

  /**
   * Pagina los movimientos de tipo transferencia
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns movimientos paginados
   */
  @Post('paginate/transferencia')
  paginateTransferencia(
    @Body() options: PaginationOptions,
    @User() user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.paginateTransferencia(options, user);
  }

  /**
   * Busca un un objeto insumo por id
   * @tests []
   * @param id del objeto insumo buscado
   * @returns insumo creado
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<CreateInformeDTO> {
    return this.almacenService.getById(id);
  }
  /**
   * Actualiza un objeto por id
   * @tests []
   * @param id del objeto a actualizar
   * @param sucursal data a actualizar en el objeto
   * @returns el objeto actualizado
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sucursal: UpdateMovimientoDTO,
  ): Promise<UpdateResult> {
    return this.almacenService.update(id, sucursal);
  }

  /**
   * Actualizar el estado del objeto insumo
   * @tests []
   * @param id del objeto insumo
   * @param status referencia al valor del campo
   * @returns objeto con el status actualizado
   */
  @Patch('status/:id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<UpdateResult> {
    return this.almacenService.setStatus(id, status);
  }

  /**
   * Borrar un objeto insumo
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.almacenService.delete(id);
  }

  @Get('filtro/:start?/:end?')
  async filtroMovimientos(
    @Param('start') start: string,
    @Param('end') end: string,
    @Res() res: Response,
  ) {
    const buffer = await this.almacenService.filtroMovimientos(start, end);
    const outputFileName = 'salida.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * Descargar movimiento
   *
   * @param id id del movimiento
   */
  @Post('descargar/movimiento')
  @HttpCode(HttpStatus.CREATED)
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  @Header('Content-Disposition', 'attachment; filename=presupuesto.docx')
  async documento(@Res() res: Response, @Body('id', ParseIntPipe) id: number) {
    //opciones de consulta de datos
    let movimiento = new CreateInformeDTO();
    movimiento = await this.almacenService.getById(id);
    if (!movimiento) {
      res.send('No hay registros para el reporte.');
    }
    const data = [];
    let fecha: any = movimiento.movimiento.fecha;
    fecha = moment(fecha).format('DD/MM/YYYY');
    for (let i = 0; i < movimiento.detalle.length; i++) {
      const mov: any = {
        insumo: movimiento.detalle[i].insumo
          ? movimiento.detalle[i].insumo.nombre
          : '',
        cantidad: movimiento.detalle[i].cantidad,
        tipoUnidad: movimiento.detalle[i].insumo.tipoUnidad
          ? movimiento.detalle[i].insumo.tipoUnidad.nombre
          : '',
        lote: movimiento.detalle[i].lote
          ? movimiento.detalle[i].lote.numero
          : '',
        caducidad: movimiento.detalle[i].lote
          ? movimiento.detalle[i].lote.caducidad
          : '',
      };
      if (movimiento.detalle[i].lote && movimiento.detalle[i].lote.caducidad) {
        mov.caducidad = moment(movimiento.detalle[i].lote.caducidad).format(
          'DD/MM/YYYY',
        );
      }
      data.push(mov);
    } //generar buffer del docx parseado con data
    delete movimiento.detalle;
    const info = {
      tipoMov: movimiento.movimiento
        ? movimiento.movimiento.tipoMovimiento
        : '',
      sucOrigen:
        movimiento.movimiento && movimiento.movimiento.sucursalOrigen
          ? movimiento.movimiento.sucursalOrigen.nombre
          : '',
      sucDestino:
        movimiento.movimiento && movimiento.movimiento.sucursalDestino
          ? movimiento.movimiento.sucursalDestino.nombre
          : '',
      notas: movimiento.movimiento ? movimiento.movimiento.notas : '',
    };
    const bufferDoc = await this.heimalService.render(
      'reportes/movimientos/movimiento',
      {
        movimiento: info,
        detalle: data,
        fecha,
      },
    );

    //preparar headers de salida
    res.set({
      'Content-Length': bufferDoc.length,
    });

    //retornar buffer en respuesta
    res.end(bufferDoc);
  }
}
