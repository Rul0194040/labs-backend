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
import { TiposMuestrasService } from './tipos-muestras.service';
import { CreateTipoMuestraDTO } from './DTOs/createTiposMuestras.dto';
import { TipoMuestraEntity } from './tipos-muestras.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateTipoMuestraDTO } from './DTOs/updateTiposMuestras.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tipos-muestras')
@Controller('tipos-muestras')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SYSADMIN)
export class TiposMuestrasController {
  constructor(private readonly tiposMuestrasService: TiposMuestrasService) {}

  /**
   * Crea el tipo de muestra
   *
   * @param tipo tipo de muestra a crear
   * @returns {TipoMuestraEntity} el tipo de muestra creado
   */
  @Post()
  create(@Body() tipo: CreateTipoMuestraDTO): Promise<TipoMuestraEntity> {
    return this.tiposMuestrasService.create(tipo);
  }

  /**
   * Retorna un tipo de muestra por id
   *
   * @param id id del tipo de muestra
   * @returns {TipoMuestraEntity} tipo de muestra consultado por id
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<TipoMuestraEntity> {
    return this.tiposMuestrasService.getById(id);
  }

  /**
   * Actualiza la informacion de un tipo de muestra
   *
   * @param id id del tipo de muestra a actualizar
   * @param tipo nuevos valores
   * @returns {UpdateResult} resultado de la actualizacion
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() tipo: UpdateTipoMuestraDTO,
  ): Promise<UpdateResult> {
    return this.tiposMuestrasService.update(id, tipo);
  }

  /**
   * Actualiza el estado de un tipo de muestra
   *
   * @param id id del tipo de muestra a cambiar el status
   * @param status estado de activacion true / false
   * @returns {UpdateResult} resultados de la actualizacion
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.tiposMuestrasService.updateStatus(id, status);
  }

  /**
   * Elimina un tipo de muestra por id
   *
   * @param id id del tipo de muestra
   * @returns {DeleteResult} resultado de la eliminacion
   */
  @Delete(':id')
  delete(@Param('id') id): Promise<DeleteResult> {
    return this.tiposMuestrasService.delete(id);
  }

  /**
   * Pagina los tipos de muestras
   *
   * @param options opciones de paginacion
   * @returns tipos de muestras paginados
   */
  @Post('paginate')
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.tiposMuestrasService.paginate(options);
  }
}
