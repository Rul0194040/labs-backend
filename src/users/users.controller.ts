import { updateUserDTO } from './dto/updateUser.dto';
import { createUserDTO } from './dto/createUser.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { RequireRule } from './decorators/require-rule.decorator';
import { User } from './decorators/user.decorator';
import { statusUserDTO } from './dto/statusUser.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RulesGuard } from './guard/rules.guard';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard, RulesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /**
   *Crear usuario
   *@tests []
   * @param user
   * @param profile
   * @returns usuario creado
   */
  @Post()
  @RequireRule('create:users')
  create(@Body() user: createUserDTO): Promise<UsersEntity> {
    return this.usersService.create(user);
  }

  /**
   * Paginar los usuarios
   * @tests []
   * @param options opciones para paginar los resultados
   * @returns objetos servicios paginados
   */
  @Post('paginate')
  @RequireRule('view:users')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.usersService.paginate(options);
  }

  /**
   * Obtener usuario por id
   *@tests []
   * @param id
   * @returns usuario
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<UsersEntity> {
    return this.usersService.getById(id);
  }

  /**
   *Actualizar usuario por id
   * @tests []
   * @param id
   * @returns updateResult
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updateUserDTO,
  ): Promise<UpdateResult> {
    return this.usersService.update(id, data);
  }

  /**
   * Desactivar a un usuario
   * @tests []
   * @param id
   * @returns objeto user, status opuesto
   */
  @Patch(':id/status')
  statusById(
    @Param('id', ParseIntPipe) id: number,
    @Body() status: statusUserDTO,
  ): Promise<UpdateResult> {
    return this.usersService.statusById(id, status);
  }
  /**
   * Borrar usuario por id
   * @tests []
   * @param id
   * @returns deleteResult
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.delete(id);
  }

  /**
   * Actualizacion de password al usuario
   * @param newPassword
   */
  @Put('password/change')
  updatePassword(
    @Body('password') password: string,
    @Body('newPassword') newPassword: string,
    @User() user: LoginIdentityDTO,
  ): Promise<UpdateResult> {
    return this.usersService.changePassword(user, password, newPassword);
  }

  @Get('profiles/types')
  getProfiles() {
    return this.usersService.getProfiles();
  }

  @Get('/profiles/tipo-empleados')
  getTiposEmpleados() {
    return this.usersService.getPerfilTipoEmpleados();
  }

  //agregar usuario a sucursal
  @Patch(':usuarioId/asignar/sucursal/:sucursalId')
  agregarUsuarioSucursal(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
  ) {
    return this.usersService.asignarUsuarioSucursal(usuarioId, sucursalId);
  }

  @Patch(':usuarioId/desasignar/sucursal/:sucursalId')
  quitarUsuarioSucursal(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
  ) {
    return this.usersService.desasignarUsuarioSucursal(usuarioId, sucursalId);
  }

  @Get('/:usuarioId/sucursales')
  obtenerSucursalesUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.usersService.getSucursales(usuarioId);
  }

  @Patch('/finalizar-grabado-roles')
  async finalizarGrabadoDeRoles(
    @User() userSesion: LoginIdentityDTO,
  ): Promise<UpdateResult> {
    const user = await this.usersService.getById(userSesion.id);
    if (!user.grabandoRules) {
      throw new HttpException(
        'Usted no está grabando roles.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.usersService.finalizarGrabado(user.id);
    //regenerar token e identity como haya quedado.
    console.log('result', result);
    //retornar un 401 para el que front lo saque con un mensaje

    throw new HttpException(
      'El grabado de roles ha finalizado, disfrute sus nuevos permisos.',
      HttpStatus.UNAUTHORIZED,
    );

    return result;
  }

  @RequireRule('cambiar:grabado:rules')
  @Patch('/activar-grabado-roles/:usuarioId')
  activarGrabadoDeRoles(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.usersService.activarGrabado(usuarioId);
  }

  @RequireRule('cambiar:grabado:rules')
  @Patch('/desactivar-grabado-roles/:usuarioId')
  desactivarGrabadoDeRoles(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.usersService.activarGrabado(usuarioId, false);
  }

  @Put('update/xls/empleados')
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
  async importarEmpleadosXLS(@UploadedFile() file: any) {
    return await this.usersService.importarEmpleados(file.path);
  }
}
