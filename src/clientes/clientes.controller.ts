import { CreateClienteDTO } from './DTOs/create-cliente.dto';
import { ClientesService } from './clientes.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateClienteDTO } from './DTOs/update-cliente.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { ClienteEntity } from './clientes.entity';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { UsersEntity } from '../users/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

@ApiTags('clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(
    @Body() cliente: CreateClienteDTO,
    @User() user: UsersEntity,
  ): Promise<ClienteEntity> {
    return this.clientesService.create(cliente, user);
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
    return this.clientesService.paginate(options);
  }

  /**
   * Busca un un objeto cliente por id
   * @tests []
   * @param id del objeto cliente buscado
   * @returns cliente creado
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<ClienteEntity> {
    return this.clientesService.getById(id);
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
    @Body() cliente: UpdateClienteDTO,
  ): Promise<UpdateResult> {
    return this.clientesService.update(id, cliente);
  }

  /**
   * Actualizar el estado del objeto cliente
   * @tests []
   * @param id del objeto cliente
   * @param status referencia al valor del campo
   * @returns objeto con el status actualizado
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.clientesService.updateStatus(id, status);
  }

  /**
   * Borrar un objeto cliente
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.clientesService.delete(id);
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
  async importarClientesXLS(@UploadedFile() file: any): Promise<any> {
    return this.clientesService.importarClientesXLS(file.path);
  }
}
