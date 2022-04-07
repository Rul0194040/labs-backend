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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { UpdateResult, DeleteResult } from 'typeorm';
import { DireccionesFiscalesService } from './direcciones-fiscales.service';
import { DireccionFiscalEntity } from './direccionesFiscales.entity';
import { CreateDireccionDTO } from './DTOs/create-direcciones-fiscales.dto';
import { UpdateDireccionDTO } from './DTOs/update-direcciones-fiscales.dto';

@ApiTags('direcciones-fiscales')
@UseGuards(JwtAuthGuard)
@Controller('direcciones-fiscales')
export class DireccionesFiscalesController {
  constructor(
    private readonly direccionesFiscalesService: DireccionesFiscalesService,
  ) {}

  /**
   * Crea una direccion fiscal
   *
   * @param direccion direccion fiscal a crear
   * @returns {DireccionFiscalEntity}
   */
  @Post()
  @RequireRule('create:direccion')
  create(
    @Body() direccion: CreateDireccionDTO,
  ): Promise<DireccionFiscalEntity> {
    return this.direccionesFiscalesService.create(direccion);
  }

  /**
   * Obtiene una direccion fiscal por id
   *
   * @param id id de la direccion fiscal
   * @returns {DireccionFiscalEntity}
   */
  @Get(':id')
  @RequireRule('view:direcciones')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DireccionFiscalEntity> {
    return this.direccionesFiscalesService.getById(id);
  }

  /**
   * Obtiene las direcciones fiscales de un paciente
   *
   * @param id id del paciente
   * @returns {DireccionFiscalEntity[]} arreglo de direcciones fiscales
   */
  @Get('paciente/:id')
  getDireccionesPaciente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DireccionFiscalEntity[]> {
    return this.direccionesFiscalesService.getDirecciones(false, id);
  }

  /**
   * Obtiene las direcciones fiscales de un cliente
   *
   * @param id id del cliente
   * @returns {DireccionFiscalEntity[]} arreglo de direcciones fiscales
   */
  @Get('cliente/:id')
  getDireccionesCliente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DireccionFiscalEntity[]> {
    return this.direccionesFiscalesService.getDirecciones(true, id);
  }

  /**
   * Actualiza una direccion fiscal
   *
   * @param id id de la direccion fiscal
   * @param direccion datos a actualizar
   * @returns {UpdateResult}
   */
  @Put(':id')
  @RequireRule('update:direcciones')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() direccion: UpdateDireccionDTO,
  ): Promise<UpdateResult> {
    return this.direccionesFiscalesService.update(id, direccion);
  }

  /**
   * Elimina una direccion fiscal
   *
   * @param id id de la direccion fiscal
   * @returns {DeleteResult}
   */
  @Delete(':id')
  @RequireRule('delete:direcciones')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.direccionesFiscalesService.delete(id);
  }
}
