import { SucursalesInsumosService } from './services/sucursalesInsumos.service';
import { LoginIdentityDTO } from './../auth/dto/loginIdentity.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateSucursalDTO } from './dto/createSucursal.dto';
import { SucursalesService } from './services/sucursales.service';
import { UpdateSucursalDTO } from './dto/updateSucursal.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { SucursalEntity } from './sucursal.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { SucursalesInsumosEntity } from './sucursalesInsumos.entity';
import { CreateSucursalesInsumosDTO } from './dto/createSucursalInsumo.dto';
import { UpdateSucursalesInsumosDTO } from './dto/updateSucursalInsumo.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { AlmacenService } from '../almacen/almacen.service';
import { MovimientosAlmacenEntity } from '@sanfrancisco/almacen/movimientosAlmacen.entity';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import * as moment from 'moment';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { CreateApiKeyDTO } from './dto/createApiKey.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';

@ApiTags('sucursales')
@Controller('sucursales')
@UseGuards(JwtAuthGuard)
// @RequireProfiles(ProfileTypes.SYSADMIN)
export class SucursalesController {
  constructor(
    private readonly sucursalesService: SucursalesService,
    private readonly sucursalesInsumosService: SucursalesInsumosService,
    private readonly almacenService: AlmacenService,
    private readonly heimalService: HeimdalService,
  ) {}

  /**
   * Se asegura que las sucursales tengan por lo menos un apikey
   *
   * @returns {ApiKeyEntity} array de apikeys creados
   */
  @Get('asegurar/api/key')
  asegurarApiKeys() {
    return this.sucursalesService.asegurarApiKeys();
  }

  /**
   * Crea una sucursal
   *
   * @tests [
   *  'Crear Matriz',
   *  'Crear Matriz - solo debe haber una',
   *  'Crear sucursal'
   * ]
   * @param sucursal Sucursal a crear
   * @returns Sucursal creada
   */
  @Post()
  @RequireRule('create:sucursales')
  create(@Body() sucursal: CreateSucursalDTO): Promise<SucursalEntity> {
    return this.sucursalesService.create(sucursal);
  }

  /**
   * Pagina las sucursales
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate')
  @RequireRule('view:sucursales')
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.sucursalesService.paginate(options);
  }

  /**
   * Pagina las sucursales
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate/minimos-matriz')
  @RequireRule('view:sucursales')
  paginateMinimosMatriz(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.sucursalesInsumosService.paginateMinimosMatriz(options);
  }

  /**
   * Pagina las transferencias recibidas para almacen
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate/transferencias-recibidas/matriz')
  @RequireRule('view:sucursales')
  paginateRecibidosMatriz(
    @Body() options: PaginationOptions,
    @User() user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.paginateRecibidosMatriz(options, user);
  }

  /**
   * Pagina los movimientos en transito para almacen
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate/transito-almacen')
  @RequireRule('view:sucursales')
  paginateTransito(
    @Body() options: PaginationOptions,
    @User() user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.paginateTransito(options, user);
  }

  /**
   * Pagina los movimientos en transito parcial
   *
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate/transito-parcial')
  @RequireRule('view:sucursales')
  paginateTransitoParcial(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.paginateTransitoParcial(options);
  }

  /**
   * Buscar sucursales por id
   * @tests []
   * @param id del objeto sucursal a buscar
   * @returns objeto sucursales
   */
  @Get(':id')
  @RequireRule('view:sucursales')
  getById(@Param('id', ParseIntPipe) id: number): Promise<SucursalEntity> {
    return this.sucursalesService.getById(id);
  }

  /**
   * Obtiene la informacion de la sucursal matriz
   *
   * @returns {SucursalEntity} sucursal matriz
   */
  @Get('matriz/detail')
  @RequireRule('view:sucursales')
  getSucursalMatriz(): Promise<SucursalEntity> {
    return this.sucursalesService.getSucursalMatriz();
  }

  /**
   * Actualizar objeto sucursales
   * @tests []
   * @param id del objeto a actualizar
   * @param sucursal data para actualizar el objeto
   * @returns objeto sucursal actualizado
   */
  @Put(':id')
  @RequireRule('update:sucursales')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sucursal: UpdateSucursalDTO,
  ): Promise<UpdateResult> {
    return this.sucursalesService.update(id, sucursal);
  }
  /**
   * Actualizar el estado del objeto sucursales
   * @tests []
   * @param id del objeto sucursales
   * @param status referencia del campo status
   * @returns objeto con el status actualizado
   */
  @Patch(':id/status')
  @RequireRule('update:sucursales')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.sucursalesService.updateStatus(id, status);
  }
  /**
   * Borrar objeto sucursales
   * @tests []
   * @param id dle objeto a borrar
   * @returns objeto delete result
   */
  @Delete(':id')
  @RequireRule('delete:sucursales')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.sucursalesService.delete(id);
  }

  /**
   * Transferencia de insumos entre sucursales
   *
   * @param idSucursal id de la sucursal en la que se crea el insumo
   * @param insumoData informacion para crear el insumo por sucursal
   * @returns {SucursalesInsumosEntity} registro creado en la tabla
   */
  @Post(':idDestino/:idOrigen/insumo')
  @RequireRule('create:sucursales')
  tranferir(
    @Param('idDestino', ParseIntPipe) idDestino: number,
    @Param('idOrigen', ParseIntPipe) idOrigen: number,
    @Body() insumoData: CreateSucursalesInsumosDTO,
  ): Promise<SucursalesInsumosEntity | UpdateResult> {
    return this.sucursalesInsumosService.transferencia(
      idDestino,
      idOrigen,
      insumoData,
    );
  }

  /**
   * Actualiza la cantidad de insumos por sucursal
   *
   * @param data cantidad de insumos por sucursal a modificar
   * @param idSucursal id de la sucursal
   * @param idInsumo id del insumo
   * @returns {UpdateResult} resultados de la actualizacion
   */
  @Put(':idSucursal/:idInsumo')
  @RequireRule('update:sucursales')
  updateSucursalInsumo(
    @Body() data: UpdateSucursalesInsumosDTO,
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
    @Param('idInsumo', ParseIntPipe) idInsumo: number,
  ): Promise<UpdateResult> {
    return this.sucursalesInsumosService.updateMinMaxSucursalInsumo(
      data,
      idSucursal,
      idInsumo,
    );
  }

  /**
   * Cancela una transferencia de insumos en estatus transito
   * @param cancelacion {CancelarTransferenciaDTO}
   * @param movimientoId id del movimiento
   * @returns {UpdateResult}
   */
  @Put('cancelar/transferencia/:movimientoId')
  @RequireRule('update:sucursales')
  cancelarTransferencia(
    @Param('movimientoId', ParseIntPipe) movimientoId: number,
  ): Promise<UpdateResult> {
    return this.sucursalesInsumosService.cancelarTransferencia(movimientoId);
  }

  /**
   * Busca insumos por sucursal y los pagina
   *
   * @param idSucursal id de la sucursal
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  @Post(':idSucursal/insumos/paginate')
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
   * Busca insumos sin existencia por sucursal y los pagina
   *
   * @param idSucursal id de la sucursal
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  @Post(':idSucursal/insumos/paginate/sin-existencias')
  @RequireRule('view:sucursales')
  paginateInsumosBySucursalSinExistencia(
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.sucursalesInsumosService.paginateInsumosBySucursalSinExistencias(
      idSucursal,
      options,
    );
  }

  /**
   * Imprimir el arqueo de una caja
   *
   * @param id id de la caja a imprimir el arqueo
   */
  @Post(':sucursalId/insumos')
  @HttpCode(HttpStatus.CREATED)
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  @Header('Content-Disposition', 'attachment; filename=presupuesto.docx')
  async arqueo(@Res() res: Response, @Body('id', ParseIntPipe) id: number) {
    //opciones de consulta de datos
    let sucursal = new SucursalEntity();
    sucursal = await this.sucursalesService.getById(id);
    if (!sucursal) {
      res.send('No hay registros para el reporte.');
    }

    //generar buffer del docx parseado con data
    const bufferDoc = await this.heimalService.render(
      'reportes/sucursales/insumosBysucursal',
      {
        nombre: sucursal.nombre,
        fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
      },
    );

    //preparar headers de salida
    res.set({
      'Content-Length': bufferDoc.length,
    });

    //retornar buffer en respuesta
    res.end(bufferDoc);
  }

  /**
   * Get de los insumos por tipo insumo
   *
   * @param tipoInsumoId id de la sucursal
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  @Get('paginate/tipo-insumo/:id')
  @RequireRule('view:sucursales')
  paginateInsumosByTipoInsumo(
    @Param('id', ParseIntPipe) tipoInsumoId: number,
  ): Promise<SucursalesInsumosEntity[]> {
    return this.sucursalesInsumosService.minimosBytipoInsumo(tipoInsumoId);
  }

  /**
   * obtienes los usuarios por sucursal
   *
   * @param idSucursal id de la sucursal
   * @returns {SucursalEntity} lista de usuarios por sucursal
   */
  @Get(':idSucursal/usuarios')
  getUsersBySucursal(
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
  ): Promise<Partial<UsersEntity>[]> {
    return this.sucursalesService.getUsersBySucursal(idSucursal);
  }

  //TODO: verificar si se esta usando este endpoint
  /**
   * obtiene los almacenes de una sucursal que sea de tipo alta
   *
   * @param idSucursal id de la sucursal
   * @returns {MovimientosAlmacenEntity[]} lista de los almacenes de altas de una sucursal
   */
  // @Post(':idSucursal/almacenes/paginate')
  // getAlmacenesBySucursal(
  //   @Param('idSucursal', ParseIntPipe) idSucursal: number,
  //   @Body() options: PaginationOptions,
  // ): Promise<PaginationPrimeNgResult> {
  //   return this.almacenService.getAlmacenesAltasBySucursal(idSucursal, options);
  // }

  /**
   * obtiene los almacenes de una sucursal que sea de tipo alta y baja
   *
   * @param idSucursal id de la sucursal
   * @returns {MovimientosAlmacenEntity[]} lista de los almacenes de altas de una sucursal
   */
  @Post(':idSucursal/almacenes/altas-bajas/paginate')
  getAlmacenesBySucursal(
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.getAlmacenesAltasBajasBySucursal(
      idSucursal,
      options,
    );
  }

  /**
   * obtiene los almacenes de una sucursal que sea de tipo transferencia
   *
   * @param idSucursal id de la sucursal
   * @returns {MovimientosAlmacenEntity[]} lista de los almacenes de transferencias de una sucursal
   */
  @Post(':idSucursal/almacenes/transferencia/paginate')
  getAlmacenesTransferenciaBySucursal(
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.almacenService.getAlmacenesTransferenciaBySucursal(
      idSucursal,
      options,
    );
  }

  @Post('verificar/transferencia')
  verificarTransferencia(@Body() data: any): Promise<MovimientosAlmacenEntity> {
    return this.sucursalesInsumosService.verificarTransferencia(
      data.movimiento,
      data.detalle,
    );
  }

  /**
   * Retorna los elementos de sucursalesInsumos en donde la existencia
   * sea menor o igual al minimo
   *
   * @param idSucursal id de la sucursal
   * @returns {SucursalesInsumosEntity} resultados
   */
  @Get('cantidad/insumos/minimo')
  @RequireRule('view:sucursales')
  insumosExistentesPaginate(): Promise<SucursalesInsumosEntity[]> {
    return this.sucursalesInsumosService.insumosExistentes();
  }

  /**
   * Retorna los insumos de sucursalesInsumos en donde la existencia
   * sea menor o igual al minimo de una sucursal
   *
   * @param idSucursal id de la sucursal
   * @returns {SucursalesInsumosEntity} añadiendo propiedad existenciaMatriz
   */
  @Get(':idSucursal/cantidad/insumos/minimo')
  @RequireRule('view:sucursales')
  insumosExistentesBySucursalPaginate(
    @Param('idSucursal', ParseIntPipe) idSucursal: number,
  ): Promise<any> {
    return this.sucursalesInsumosService.insumosExistentesBySucursal(
      idSucursal,
    );
  }

  /**
   * Retorna los insumos de sucursalesInsumos en donde la existencia
   * sea menor o igual al minimo de una sucursal matriz
   *
   * @param movimientoId id del movimiento requisicion
   * @returns {} añadiendo propiedad existenciaMatriz
   */
  @Get('insumos/requisicion/:movimientoId')
  insumosExistentesByRequisicion(
    @Param('movimientoId', ParseIntPipe) movimientoId: number,
  ): Promise<any> {
    return this.almacenService.getInsumosByRequisicion(movimientoId);
  }

  @Get('reporte/doc/listado')
  async sucursales(@Res() res: Response) {
    //definir nombre del archivo de salida
    const outputFileName = 'salida.docx';
    //opciones de consulta de datos
    const options: PaginationOptions = {
      sort: '',
      direction: 'ASC',
      skip: 0,
      take: 100,
      filters: {},
    };

    //consultar
    const response: PaginationPrimeNgResult =
      await this.sucursalesService.paginate(options);
    if (!response.data.length) {
      res.send('No hay registros para el reporte.');
    }
    //generar buffer del docx parseado con data
    const bufferDoc = await this.heimalService.render(
      'reportes/sucursales/listado',
      {
        sucursales: response.data,
        fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
      },
    );

    //preparar headers de salida
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': bufferDoc.length,
    });

    //retornar buffer en respuesta
    res.end(bufferDoc);
  }

  //Get('usuarios/paginate')
  //Post('usuarios/add') //crear usuario y asignar a sucursal
  //Patch('usuarios/change')//cambiar nombre
  //Patch('usuarios/status')//activar/desactivar usuario

  /**
   * Subir archivo del usuario
   * @param file
   * @param req
   */
  @Put('update/minimos-maximos/xls')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          (file.originalname.split('.').reverse()[0] === 'xls' ||
            file.originalname.split('.').reverse()[0] === 'xlsx')
        ) {
          return cb(null, true);
        }
        return cb(
          new Error(
            'Tipo de archivo no aceptado, se aceptan solamente xlsx y xls',
          ),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dirPath = './uploads/xls';
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          cb(null, dirPath);
        },
      }),
    }),
  )
  async uploadMinimos(@UploadedFile() file: any): Promise<any> {
    return this.sucursalesInsumosService.procesarMinimosMaximos(file.path);
  }

  @Put('update/insumos-sucursal/xls/:sucursalId')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          (file.originalname.split('.').reverse()[0] === 'xls' ||
            file.originalname.split('.').reverse()[0] === 'xlsx')
        ) {
          return cb(null, true);
        }
        return cb(
          new Error(
            'Tipo de archivo no aceptado, se aceptan solamente xlsx y xls',
          ),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dirPath = './uploads/xls';
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          cb(null, dirPath);
        },
      }),
    }),
  )
  async updateInsumosSucursal(
    @UploadedFile() file: any,
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
  ): Promise<any> {
    return this.sucursalesInsumosService.importarInsumosSucursal(
      file.path,
      sucursalId,
    );
  }

  @Put('update/insumos/xls/todas')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          (file.originalname.split('.').reverse()[0] === 'xls' ||
            file.originalname.split('.').reverse()[0] === 'xlsx')
        ) {
          return cb(null, true);
        }
        return cb(
          new Error(
            'Tipo de archivo no aceptado, se aceptan solamente xlsx y xls',
          ),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dirPath = './uploads/xls';
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          cb(null, dirPath);
        },
      }),
    }),
  )
  async updateInsumosTodas(@UploadedFile() file: any): Promise<any> {
    return this.sucursalesInsumosService.importarInsumosTodas(file.path);
  }

  /**
   * Crea un api key para una sucursal
   *
   * @param {nombre:string} datos nombre del api key
   * @param {number} sucursalId id de la sucursal
   * @returns
   */
  @Put('generate/:sucursalId/apikey')
  agergarApiKey(
    @Body() datos: CreateApiKeyDTO,
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
  ): Promise<any> {
    return this.sucursalesService.crearApiKey(sucursalId, datos.nombre);
  }

  /**
   * Cambiar el estatus a un apikey
   *
   * @param {string} apiKey apikey a cambiar el estatus
   * @param {boolean} status el nuevo estatus
   * @returns
   */
  @Patch('apikey/:apiKey/status/:status')
  desactivarApiKey(
    @Param('apiKey') apiKey: string,
    @Param('status', ParseBoolPipe) status: boolean,
  ): Promise<any> {
    return this.sucursalesService.estatusApiKey(apiKey, status);
  }

  /**
   * Cambia el nombre a un apikey
   *
   * @param {nombre:string} datos nombre nuevo para el apikey
   * @param apiKey api key a renombrar
   * @returns
   */
  @Patch('apikey/:apiKey/rename')
  renombrarApiKey(
    @Body() datos: CreateApiKeyDTO,
    @Param('apiKey') apiKey: string,
  ): Promise<any> {
    return this.sucursalesService.renameApiKey(apiKey, datos.nombre);
  }

  /**
   * Afectar los minimos y maximos de matriz con la suma de minimos
   * y maximos de las otras sucursales
   *
   * @returns array de insumos afectados
   */
  @Get('insumos/calculo/min-max/matriz')
  calculoMinMaxMatriz(): Promise<
    { insumo: number; minimo: number; maximo: number }[]
  > {
    return this.sucursalesInsumosService.calcularMinimosMaximosMatriz();
  }

  /**
   * Importar promedio, maximos y minimos por sucursal de un XLS
   * Culumnas: A:insumoId, B:nombreInsumo, C: promedio, D: minimo, E:maximo
   * inicio de informacion en la linea 6
   *
   * @returns array de insumos afectados
   */
  @Put('insumos/importar/min-max/sucursal/:sucursalId')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          (file.originalname.split('.').reverse()[0] === 'xls' ||
            file.originalname.split('.').reverse()[0] === 'xlsx')
        ) {
          return cb(null, true);
        }
        return cb(
          new Error(
            'Tipo de archivo no aceptado, se aceptan solamente xlsx y xls',
          ),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dirPath = './uploads/xls';
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          cb(null, dirPath);
        },
      }),
    }),
  )
  async importarMinMaxSucursal(
    @UploadedFile() file: any,
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
  ): Promise<any> {
    return this.sucursalesInsumosService.importarMinMaxSucursal(
      file.path,
      sucursalId,
    );
  }
}
