import { DeleteResult } from 'typeorm';
import { UsersService } from '@sanfrancisco/users/users.service';
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
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CreateEmpleadoDTO } from './DTO/create-empleado.dto';
import { UpdateEmpleadoDTO } from './DTO/update-empleado.dto';
import { EmpleadosService } from './empleados.service';

@Controller('empleados')
@ApiTags('empleados')
@UseGuards(JwtAuthGuard)
export class EmpleadosController {
  constructor(
    private readonly empleadoService: EmpleadosService,
    private readonly userService: UsersService,
  ) {}
  @Get('entradas-salidas')
  getEntradasSalids(@User() user: LoginIdentityDTO) {
    return this.empleadoService.getEntradasSalidas(user.id);
  }

  /**
   * Crear empleado
   *
   * @param empleado Data del empleado
   * @returns {UsersEntity}
   */
  @Post()
  crearEmpleado(@Body() empleado: CreateEmpleadoDTO): Promise<UsersEntity> {
    return this.userService.create(empleado);
  }

  /**
   * Get by id
   *
   * @param id
   * @returns {UsersEntity}
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<UsersEntity> {
    return this.userService.getById(id);
  }

  /**
   * Actualizar un empleado
   *
   * @param empleadoId id del empleado
   * @param empleado datos a actualizar del empleado
   * @returns {UpdateResult}
   */
  @Put(':empleadoId')
  actualizarEmpleado(
    @Param('empleadoId', ParseIntPipe) empleadoId: number,
    @Body() empleado: UpdateEmpleadoDTO,
  ): Promise<UsersEntity> {
    return this.empleadoService.updateEmpleado(empleadoId, empleado);
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
    return this.empleadoService.empleadosPaginate(options);
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {DeleteResult}
   */
  @Delete(':empleadoId')
  deleteEmpleado(
    @Param('empleadoId', ParseIntPipe) empleadoId: number,
  ): Promise<DeleteResult> {
    return this.empleadoService.delete(empleadoId);
  }
}
