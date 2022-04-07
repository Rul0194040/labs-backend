import { PaginationPrimeNgResult } from './../common/DTO/pagination-prime-Ng-result.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateServiciosInsumosDTO } from './DTOs/createServicioInsumo.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { CreateServicioDTO } from './DTOs/createServicio.dto';
import { UpdateServicioDTO } from './DTOs/updateServicio.dto';
import { ServicioEntity } from './servicio.entity';
import { ServiciosService } from './servicios.service';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { ServiciosInsumosEntity } from './servicios-insumos.entity';
import { UpdateServiceCatalogsDTO } from './DTOs/updateServiceCatalogs.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
@ApiTags('servicios')
@Controller('servicios')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SYSADMIN)
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  /**
   * Crea un objeto servicio
   * @tests []
   * @param servicio data necesaria para crear un servicio
   * @returns servicio creado
   */
  @Post()
  @RequireRule('create:servicios')
  async create(@Body() servicio: CreateServicioDTO): Promise<ServicioEntity> {
    return this.serviciosService.create(servicio);
  }

  /**
   * Actualiza catalogos de un servicio
   *
   * @param id id del servicio
   * @param catalogs catalogos a actualizar
   * @returns resultados de la actualizacion
   */
  @Put(':id/catalogs')
  @RequireRule('update:servicios')
  updateCatalogs(
    @Param('id', ParseIntPipe) id: number,
    @Body() catalogs: UpdateServiceCatalogsDTO,
  ): Promise<UpdateResult> {
    return this.serviciosService.updateServiceCatalogs(id, catalogs);
  }

  /**
   * Paginar los servicios
   * @tests []
   * @param options opciones para paginar los resultados
   * @returns objetos servicios paginados
   */
  @Post('paginate')
  @RequireRule('view:servicios')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.serviciosService.paginate(options);
  }
  /**
   * Crear objetos servicio-insumo
   * @tests []
   * @param data para crear registros en la tabla servicio-insumo
   * @returns registro de insumos-servicios
   */
  @Post(':idServicio/insumo')
  async agragar(
    @Param('idServicio', ParseIntPipe) idServicio: number,
    @Body() insumo: CreateServiciosInsumosDTO,
  ): Promise<ServiciosInsumosEntity> {
    return this.serviciosService.agregarInsumo(idServicio, insumo);
  }

  /**
   * Paginar insumos-servicios
   * @tests []
   * @param options para paginar insumos-servicios
   * @returns paginacion de insumos-servicios
   */
  @Post(':idServicio/insumos/paginate')
  paginateInsumo(
    @Param('idServicio', ParseIntPipe) idServicio: number,
    @Body() options: PaginationOptions,
  ): Promise<any> {
    return this.serviciosService.paginateServicioInsumo(idServicio, options);
  }
  /**
   * Buscar un objeto servicio por id
   * @tests []
   * @param id para buscar un objeto servicio
   * @returns objeto servicio
   */
  @Get(':id')
  @RequireRule('view:servicios')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServicioEntity> {
    return this.serviciosService.getById(id);
  }

  /**
   * Actualizar un objeto servicio
   * @tests []
   * @param id del objeto servicio a actualizar
   * @param data para actualizar el objeto
   * @returns objeto servicio actualizado
   */
  @Put(':id')
  @RequireRule('update:servicios')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateServicioDTO,
  ): Promise<UpdateResult> {
    return this.serviciosService.update(id, data);
  }
  /**
   * Borrar registro servicio
   * @tests []
   * @param id del objeto servicio a borrar
   * @returns delete result, afectado un objeto
   */
  @Delete(':id')
  @RequireRule('delete:servicios')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.serviciosService.delete(id);
  }
  /**
   * Borrar registro insumo-servicio
   * @tests []
   * @param id eliminar registro en insumo-servicio
   * @returns delete result, afectado un objeto
   */
  @Delete('serviciosInsumo/:id')
  quitarInsumo(@Param('id') id: number): Promise<DeleteResult> {
    return this.serviciosService.quitarInsumo(id);
  }

  /**
   * Importa los servicios de un xsl exportado de px lab, toma en cuenta clave, nombre,tipoMuestra, sinonimo 1, sinonimo 2, precio y Grupo
   *
   * @param file archivo xls de insumos
   * @returns
   */
  @Put('update/xls')
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
  async importarServiciosXLS(@UploadedFile() file: any): Promise<any> {
    return this.serviciosService.importarServiciosXLS(file.path);
  }
}
