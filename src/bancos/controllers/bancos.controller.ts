import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BancosService } from '../bancos.service';
import { CreateBancoDto } from '../dto/create-banco.dto';
import { UpdateBancoDto } from '../dto/update-banco.dto';
import { BancoEntity } from '../entities/banco.entity';

@Controller('bancos')
@ApiTags('bancos')
export class BancosController {
  constructor(private readonly bancoService: BancosService) {}

  @Post()
  create(@Body() banco: CreateBancoDto): Promise<BancoEntity> {
    return this.bancoService.create(banco);
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
    return this.bancoService.paginate(options);
  }

  /**
   * Busca un un objeto banco por id
   * @tests []
   * @param id del objeto banco buscado
   * @returns banco creado
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<BancoEntity> {
    return this.bancoService.getById(id);
  }
  /**
   * Actualiza un objeto por id
   * @tests []
   * @param id del objeto a actualizar
   * @returns el objeto actualizado
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() banco: UpdateBancoDto,
  ): Promise<UpdateResult> {
    return this.bancoService.update(id, banco);
  }

  /**
   * Borrar un objeto banco
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.bancoService.delete(id);
  }
}
