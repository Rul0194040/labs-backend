import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { UpdateProveedorDTO } from './DTOs/updateProveedor.dto';
import { PaginationOptions } from '../../common/DTO/paginationPrimeNg.dto';
import { CreateProveedorDTO } from './DTOs/createProveedor.dto';
import { ProveedorEntity } from './proveedores.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';

@ApiTags('proveedores')
@UseGuards(JwtAuthGuard)
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  /**
   * Retorna un proveedor por id
   *
   * @param id id del proveedor
   * @returns {ProveedorEntity} proveedor
   */
  @Get(':id')
  GetById(@Param('id', ParseIntPipe) id: number): Promise<ProveedorEntity> {
    return this.proveedoresService.getById(id);
  }

  /**
   * Crear un proveedor
   *
   * @param data información del proveedor a guardar
   * @returns {ProveedorEntity} proveedor creado
   */
  @Post()
  create(@Body() data: CreateProveedorDTO): Promise<ProveedorEntity> {
    return this.proveedoresService.create(data);
  }

  /**
   * Actualiza la informacion de un proveedor
   *
   * @param id id del proveedor a actualizar
   * @param data informacion actualizada
   * @returns {UpdateResult} Resultados de la actualizacion
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProveedorDTO,
  ): Promise<UpdateResult> {
    return this.proveedoresService.update(id, data);
  }

  /**
   * Elimina un proveedor por id
   *
   * @param id id del proveedor a eliminar
   * @returns {DeleteResult} resultados de la eliminación
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.proveedoresService.delete(id);
  }

  /**
   * Pagina proveedores
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.proveedoresService.paginate(options);
  }
}
