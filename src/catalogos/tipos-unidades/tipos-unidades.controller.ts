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
  UseGuards,
} from '@nestjs/common';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { TiposUnidadesService } from './tipos-unidades.service';
import { createTiposUnidadesDTO } from './DTOs/createTiposUnidades.dto';
import { TipoUnidadEntity } from './tipos-unidades.entity';
import { UpdateTiposUnidadesDTO } from './DTOs/updateTiposUnidades.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';

@ApiTags('tipos-unidades')
@Controller('tipos-unidades')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SYSADMIN)
export class TiposUnidadesController {
  constructor(private readonly tiposUnidadesService: TiposUnidadesService) {}

  /**
   * Crea el tipo de unidad
   *
   * @param tipo tipo de unidad a crear
   * @returns {TipoUnidadEntity} el tipo de unidad creado
   */
  @Post()
  create(@Body() tipo: createTiposUnidadesDTO): Promise<TipoUnidadEntity> {
    return this.tiposUnidadesService.create(tipo);
  }

  /**
   * Retorna un tipo de unidad por id
   *
   * @param id id del tipo de unidad
   * @returns {TipoUnidadEntity} tipo de unidad consultado por id
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<TipoUnidadEntity> {
    return this.tiposUnidadesService.getById(id);
  }

  /**
   * Actualiza la informacion de un tipo de unidad
   *
   * @param id id del tipo de unidad a actualizar
   * @param tipo nuevos valores
   * @returns {UpdateResult} resultado de la actualizacion
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() tipo: UpdateTiposUnidadesDTO,
  ): Promise<UpdateResult> {
    return this.tiposUnidadesService.update(id, tipo);
  }

  /**
   * Actualiza el estado de un tipo de unidad
   *
   * @param id id del tipo de unidad a cambiar el status
   * @param status estado de activacion true / false
   * @returns {UpdateResult} resultados de la actualizacion
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.tiposUnidadesService.updateStatus(id, status);
  }

  /**
   * Elimina un tipo de unidad por id
   *
   * @param id id del tipo de unidad
   * @returns {DeleteResult} resultado de la eliminacion
   */
  @Delete(':id')
  delete(@Param('id') id): Promise<DeleteResult> {
    return this.tiposUnidadesService.delete(id);
  }

  /**
   * Pagina los tipos de unidades
   *
   * @param options opciones de paginacion
   * @returns tipos de unidades paginados
   */
  @Post('paginate')
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.tiposUnidadesService.paginate(options);
  }
}
