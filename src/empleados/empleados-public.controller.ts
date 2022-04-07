import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { UsersService } from '@sanfrancisco/users/users.service';
import { plainToClass } from 'class-transformer';
import { EnableEmpleadoDTO } from './dto/enable-empleado.dto';
import { EmpleadosService } from './empleados.service';

@Controller('public/empleados')
@ApiTags('empleados')
export class EmpleadosPublicController {
  constructor(
    private readonly empleadosService: EmpleadosService,
    private readonly usersService: UsersService,
  ) {}
  @Put('enable-account')
  async activarCuenta(@Body() data: EnableEmpleadoDTO) {
    const user = await this.usersService.getByEmail(data.email);
    if (!user) {
      throw new HttpException('No existe la cuenta', HttpStatus.NOT_FOUND);
    }
    /*
    if (user.active) {
      throw new HttpException(
        'Esta cuenta ya esta activa.',
        HttpStatus.BAD_REQUEST,
      );
    }*/
    await this.usersService.statusById(user.id, { active: true });

    return this.usersService.changePassword(
      plainToClass(LoginIdentityDTO, user),
      'password',
      (Math.random() * 10000000).toFixed(0),
    );
  }
}
