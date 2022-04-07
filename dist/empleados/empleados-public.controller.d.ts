import { UsersService } from '@sanfrancisco/users/users.service';
import { EnableEmpleadoDTO } from './dto/enable-empleado.dto';
import { EmpleadosService } from './empleados.service';
export declare class EmpleadosPublicController {
    private readonly empleadosService;
    private readonly usersService;
    constructor(empleadosService: EmpleadosService, usersService: UsersService);
    activarCuenta(data: EnableEmpleadoDTO): Promise<import("typeorm").UpdateResult>;
}
