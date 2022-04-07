import { DetalleCompraDTO } from './DTO/detalle-compra.dto';
import { GenerarOrdenDTO } from './DTO/generar-orden.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Header,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ComprasService } from './compras.service';
import { InformeCompraDTO } from './DTO/informe-compra.dto';
import { InformeResultDTO } from './DTO/informe-result.dto';
import { GetCompraDTO } from './DTO/get-compra.dto';
import { AgregarInsumoDTO } from './DTO/agregarInsumoDetalle.dto';
import { DetalleCompraEntity } from './detallesCompras.entity';
import { Response } from 'express';
import * as moment from 'moment';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { AltaByCompraDTO } from './DTO/altaBycompra.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FileResultDTO } from '@sanfrancisco/common/DTO/fileResult.dto';

@ApiTags('compras')
@UseGuards(JwtAuthGuard)
@Controller('compras')
export class ComprasController {
  constructor(
    private readonly compraService: ComprasService,
    private readonly heimalService: HeimdalService,
  ) {}

  @Post()
  @RequireRule('create:compra')
  create(@Body() compra: InformeCompraDTO): Promise<InformeResultDTO> {
    return this.compraService.create(compra);
  }

  @Post('orden')
  @RequireRule('create:compra')
  generarCompra(@Body() compra: GenerarOrdenDTO): Promise<HttpStatus> {
    return this.compraService.generarOrden(compra);
  }

  @Post('paginate')
  @RequireRule('view:compras')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.compraService.paginate(options);
  }

  @Get(':id')
  @RequireRule('view:compras')
  getById(@Param('id', ParseIntPipe) id: number): Promise<GetCompraDTO> {
    return this.compraService.getById(id);
  }

  @Post('detalleCompra/:compraId')
  @RequireRule('update:compras')
  createDetalle(
    @Param('compraId', ParseIntPipe) compraId: number,
    @Body() detalle: AgregarInsumoDTO,
  ): Promise<DetalleCompraEntity[]> {
    return this.compraService.createDetalleCompra(compraId, detalle);
  }

  @Post('ordenCompra/:compraId')
  @RequireRule('update:compras')
  FinalizarOrdenCompra(
    @Param('compraId', ParseIntPipe) compraId: number,
    @Body() data: AltaByCompraDTO,
    @User() user: LoginIdentityDTO,
  ): Promise<InformeResultDTO> {
    return this.compraService.altaBycompra(compraId, data, user);
  }

  /**
   * Envia un correo al email del proveedor sobre la orden de compra
   * @param compraId
   * @param user
   * @returns {HttpStatus}
   */
  @Post('enviar-compra/:compraId')
  EnviarCompra(
    @Param('compraId', ParseIntPipe) compraId: number,
  ): Promise<HttpStatus> {
    return this.compraService.sendToProveedor(compraId);
  }

  @Put('detalleCompra/:detalleId')
  @RequireRule('update:compras')
  updateDetalle(
    @Param('detalleId', ParseIntPipe) detalleId: number,
    @Body() detalle: DetalleCompraDTO,
  ): Promise<DetalleCompraEntity> {
    return this.compraService.UpdateDetalleCompra(detalleId, detalle);
  }

  @Put('conClave/:id')
  @RequireRule('update:compras')
  updateClave(
    @Param('id', ParseIntPipe) id: number,
    @Body('clave') clave: boolean,
  ): Promise<UpdateResult> {
    return this.compraService.UpdateCompraClave(id, clave);
  }

  @Patch(':id/status')
  @RequireRule('update:compras')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.compraService.updateStatus(id, status);
  }

  @Delete(':id')
  @RequireRule('delete:compras')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.compraService.delete(id);
  }

  @Delete('detalle-compras/:id')
  @RequireRule('delete:compras')
  deleteDetalle(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.compraService.deleteDetalleCompras(id);
  }

  @Put('cotizacion/importar/:id/:numCotizacion')
  @UseInterceptors(
    FileInterceptor('cotizacion', {
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          file.originalname.split('.').reverse()[0] === 'pdf'
        ) {
          return cb(null, true);
        }
        return cb(
          new Error('Tipo de archivo no aceptado, se aceptan solamente pdf'),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dirPath = './uploads/cotizaciones/';
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          cb(null, dirPath);
        },
        filename: (req, file, cb) => {
          const fileNameDest = file.originalname;
          cb(null, fileNameDest);
        },
      }),
    }),
  )
  updateCotizacion(
    @UploadedFile() file: FileResultDTO,
    @Param('id', ParseIntPipe) id: number,
    @Param('numCotizacion', ParseIntPipe) numCotizacion: number,
  ): Promise<UpdateResult> {
    return this.compraService.importarCotizacion(
      id,
      numCotizacion,
      file.filename,
    );
  }

  @Get('descargar/cotizacion/:id')
  async descargarCotizacion(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const file = await this.compraService.descargarCotizacion(id);
    res.sendFile(file, {
      root: `./uploads/cotizaciones`,
    });
  }

  /**
   * Imprimir orden de compra
   *
   * @param id id de la orden
   */
  @Post('generar/orden-compra')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=presupuesto.pdf')
  async arqueo(@Res() res: Response, @Body('id', ParseIntPipe) id: number) {
    //opciones de consulta de datos
    let compra = new GetCompraDTO();
    compra = await this.compraService.getById(id);
    if (!compra) {
      res.send('No hay registros para el reporte.');
    }
    let fechaCompra: any = compra.compra.fecha;
    fechaCompra = moment(fechaCompra).format('DD/MM/YYYY');

    let total: number = 0;
    for (const det of compra.detalle) {
      total = det.cantidad * det.precio;
    }
    const totalIva: number = total + total * 0.16;

    let bufferDoc: any;
    if (compra.compra.conClave) {
      //generar buffer del docx parseado con data
      bufferDoc = await this.heimalService.render(
        'reportes/compras/ordenCompra',
        {
          orden: compra,
          fechaCompra: fechaCompra,
          fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
          total,
          totalIva,
        },
        'pdf',
      );
    } else {
      //generar buffer del docx parseado con data
      bufferDoc = await this.heimalService.render(
        'reportes/compras/ordenCompra_sinClave',
        {
          orden: compra,
          fechaCompra: fechaCompra,
          fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
          total,
          totalIva,
        },
        'pdf',
      );
    }

    //preparar headers de salida
    res.set({
      'Content-Length': bufferDoc.length,
    });

    //retornar buffer en respuesta
    res.end(bufferDoc);
  }
}
