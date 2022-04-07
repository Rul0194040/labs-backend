import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PuestosDepartamentosService } from '../puestos-departamentos.service';
import { CreateDepartamentoDTO } from '../DTOs/create-departamento.dto';
import { UpdateDepartamentoDTO } from '../DTOs/update-departamento.dto';
import { DepartamentoEntity } from '../entity/departamento.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../../../auth/guards/jwt/jwt-auth.guard';
import { PaginationOptions } from '../../../common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';

@Controller('departamentos')
// @UseGuards(JwtAuthGuard)
export class DepartamentosController {
  constructor(
    private readonly puestosDepartamentosService: PuestosDepartamentosService,
  ) {}

  /**
   * Crear departamento
   *
   * @param departamento Data del departamento
   * @returns {DepartamentoEntity}
   */
  @Post()
  crearDepartamento(
    @Body() departamento: CreateDepartamentoDTO,
  ): Promise<DepartamentoEntity> {
    return this.puestosDepartamentosService.crearDepartamento(departamento);
  }

  /**
   * Get by id
   *
   * @param id
   * @returns {DepartamentoEntity}
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<DepartamentoEntity> {
    return this.puestosDepartamentosService.getDepartamentoById(id);
  }

  /**
   * Actualizar un departamento
   *
   * @param departamentoId Id del departamento
   * @param departamento datos a actualizar del departamento
   * @returns {UpdateResult}
   */
  @Put(':departamentoId')
  actualizarDepartamento(
    @Param('departamentoId', ParseIntPipe) departamentoId: number,
    @Body() departamento: UpdateDepartamentoDTO,
  ): Promise<UpdateResult> {
    return this.puestosDepartamentosService.actualizarDepartamento(
      departamentoId,
      departamento,
    );
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.puestosDepartamentosService.departamentosPaginate(options);
  }

  /**
   * Delete
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Post(':departamentoId')
  delete(
    @Param('departamentoId', ParseIntPipe) departamentoId: number,
  ): Promise<DeleteResult> {
    return this.puestosDepartamentosService.deleteDepartamento(departamentoId);
  }
}
