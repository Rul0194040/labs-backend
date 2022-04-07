import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { PresupuestoDetalleEntity } from './presupuestosDetalle.entity';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { UpdatePresupuestoDTO } from './DTO/update-presupuesto.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { CreatePresupuestoDTO } from './DTO/create-presupuesto.dto';
import { PresupuestosService } from './presupuestos.service';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { InformePresupuestoDTO } from './DTO/informe-presupuesto.dto';
import { EstatusPresupuesto } from './EstatusPresupuesto.enum';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult, DeleteResult, getRepository } from 'typeorm';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import * as moment from 'moment';
import { Response } from 'express';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { PresupuestoEntity } from './presupuesto.entity';

@ApiTags('presupuestos')
@UseGuards(JwtAuthGuard)
@Controller('presupuestos')
export class PresupuestosController {
  constructor(
    private readonly presupuestoServices: PresupuestosService,
    private readonly heimalService: HeimdalService,
  ) {}

  @Post()
  @RequireRule('create:presupuesto')
  create(
    @Body() presupuesto: CreatePresupuestoDTO,
    @User() user: LoginIdentityDTO,
  ): Promise<InformePresupuestoDTO> {
    return this.presupuestoServices.create(presupuesto, user);
  }

  @Post('paginate')
  @RequireRule('view:presupuestos')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.presupuestoServices.paginate(options);
  }

  @Post('create-detalle-presupuesto/:id')
  @RequireRule('view:presupuestos')
  UpdateInsumoDetalle(
    @Param('id') id: number,
    @Body() presupuesto: UpdatePresupuestoDTO,
  ): Promise<PresupuestoDetalleEntity> {
    return this.presupuestoServices.UpdateInsumoDetallePresupuesto(
      id,
      presupuesto,
    );
  }

  @Get(':id')
  @RequireRule('view:presupuestos')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InformePresupuestoDTO> {
    return this.presupuestoServices.getById(id);
  }

  @Put(':id')
  @RequireRule('update:presupuestos')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presupuesto: UpdatePresupuestoDTO,
  ): Promise<UpdateResult> {
    return this.presupuestoServices.updateDetallePresupuesto(id, presupuesto);
  }

  @Patch(':id/status')
  @RequireRule('update:presupuestos')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('estatus') estatus: EstatusPresupuesto,
  ): Promise<UpdateResult> {
    return this.presupuestoServices.updateStatus(id, estatus);
  }

  @Delete('detalle/:id')
  @RequireRule('delete:presupuestos')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.presupuestoServices.deletePresupuestoDetalle(id);
  }

  /**
   * Envia un correo al email del proveedor sobre el presupuesto
   * @param idPresupuesto
   * @param user
   * @returns {HttpStatus}
   */
  @Post('enviar-presupuesto/:idPresupuesto')
  EnviarCompra(
    @Param('idPresupuesto', ParseIntPipe) idPresupuesto: number,
    @Body('proveedorSeleccionadoId', ParseIntPipe)
    proveedorSeleccionadoId: number,
  ): Promise<HttpStatus> {
    return this.presupuestoServices.sendToProveedor(
      idPresupuesto,
      proveedorSeleccionadoId,
    );
  }

  /**
   * Imprimir presupuesto
   *
   * @param id id del presupuesto
   */
  @Post('generar/presupuesto')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=presupuesto.pdf')
  async sendPres(
    @Res() res: Response,
    @Body('id', ParseIntPipe) id: number,
    @Body('proveedorSeleccionadoId', ParseIntPipe)
    proveedorSeleccionadoId: number,
  ) {
    const presupuesto = await getRepository(PresupuestoEntity).findOne(id);

    if (!presupuesto) {
      res.send('No hay registros para el reporte.');
    }

    const Detalle = await getRepository(PresupuestoDetalleEntity)
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.insumo', 'insumo')
      .where(
        'detalle.presupuestoId=:id AND detalle.proveedorSeleccionadoId=:proveedorSeleccionadoId',
        {
          id: presupuesto.id,
          proveedorSeleccionadoId,
        },
      )
      .getMany();

    let totalPresupuesto: number = 0;
    for (const det of Detalle) {
      totalPresupuesto += det.precioSeleccionado;
    }
    const totalIva = totalPresupuesto + totalPresupuesto * 0.16;

    const proveedor = await getRepository(ProveedorEntity).findOne(
      proveedorSeleccionadoId,
    );
    let fechaPresupuesto: any = presupuesto.createdAt;
    fechaPresupuesto = moment(fechaPresupuesto).format('DD/MM/YYYY');
    const formato: InformePresupuestoDTO = {
      presupuesto: presupuesto,
      detalle: Detalle,
    };

    //generar buffer del docx parseado con data
    const bufferDoc = await this.heimalService.render(
      'reportes/presupuestos/presupuesto',
      {
        formatoPresupuesto: formato,
        fechaPresupuesto,
        proveedor,
        fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
        totalPresupuesto,
        totalIva,
      },
      'pdf',
    );

    console.log(bufferDoc);

    //preparar headers de salida
    res.set({
      'Content-Length': bufferDoc.length,
    });

    //retornar buffer en respuesta
    res.end(bufferDoc);

    //opciones de consulta de datos
    //let presupuesto = new InformePresupuestoDTO();
    //Falta info del proveedor -- Agregar
    //Será presupuesto por proveedor
  }
}
