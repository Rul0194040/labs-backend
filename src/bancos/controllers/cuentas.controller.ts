import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { BancosService } from '../bancos.service';
import { CreateCuentaDto } from '../dto/create-cuenta.dto';
import { UpdateCuentaDto } from '../dto/update-cuenta.dto';
import { CuentaBancariaEntity } from './../entities/cuenta-bancaria.entity';

@Controller('bancos/cuentas')
export class CuentasController {
  constructor(private readonly bancoService: BancosService) {}

  @Post()
  create(@Body() cuenta: CreateCuentaDto): Promise<CuentaBancariaEntity> {
    return this.bancoService.createCuenta(cuenta);
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
    return this.bancoService.paginateCuenta(options);
  }

  /**
   * Busca un un objeto cuenta por id
   * @tests []
   * @param id del objeto cuenta buscado
   * @returns cuenta creado
   */
  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CuentaBancariaEntity> {
    return this.bancoService.getCuentaById(id);
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
    @Body() cuenta: UpdateCuentaDto,
  ): Promise<UpdateResult> {
    return this.bancoService.updateCuenta(id, cuenta);
  }

  /**
   * Borrar un objeto cuenta
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.bancoService.deleteCuenta(id);
  }
}
