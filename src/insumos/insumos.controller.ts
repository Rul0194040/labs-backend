import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateInsumoDTO } from './DTOs/createInsumo.dto';
import { UpdateInsumoDTO } from './DTOs/updateInsumo.dto';
import { InsumoEntity } from './insumo.entity';
import { InsumosService } from './insumos.service';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('insumos')
@Controller('insumos')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SYSADMIN)
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Post()
  @RequireRule('create:insumo')
  create(@Body() insumo: CreateInsumoDTO): Promise<InsumoEntity> {
    return this.insumosService.create(insumo);
  }

  /**
   * Pagina los insumos
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns insumos paginados
   */
  @Post('paginate')
  @RequireRule('view:insumos')
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.insumosService.paginate(options);
  }

  /**
   * Busca un un objeto insumo por id
   * @tests []
   * @param id del objeto insumo buscado
   * @returns insumo creado
   */
  @Get(':id')
  @RequireRule('view:insumos')
  getById(@Param('id', ParseIntPipe) id: number): Promise<InsumoEntity> {
    return this.insumosService.getById(id);
  }
  /**
   * Actualiza un objeto por id
   * @tests []
   * @param id del objeto a actualizar
   * @param sucursal data a actualizar en el objeto
   * @returns el objeto actualizado
   */
  @Put(':id')
  @RequireRule('update:insumos')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sucursal: UpdateInsumoDTO,
  ): Promise<UpdateResult> {
    return this.insumosService.update(id, sucursal);
  }

  /**
   * Actualizar el estado del objeto insumo
   * @tests []
   * @param id del objeto insumo
   * @param status referencia al valor del campo
   * @returns objeto con el status actualizado
   */
  @Patch(':id/status')
  @RequireRule('update:insumos')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.insumosService.updateStatus(id, status);
  }

  /**
   * Borrar un objeto insumo
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  @RequireRule('delete:insumos')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.insumosService.delete(id);
  }
}
