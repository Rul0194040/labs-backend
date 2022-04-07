import { DeleteResult } from 'typeorm';
import { UsersService } from '@sanfrancisco/users/users.service';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CreateEmpleadoDTO } from './DTO/create-empleado.dto';
import { UpdateEmpleadoDTO } from './DTO/update-empleado.dto';
import { EmpleadosService } from './empleados.service';
export declare class EmpleadosController {
    private readonly empleadoService;
    private readonly userService;
    constructor(empleadoService: EmpleadosService, userService: UsersService);
    getEntradasSalids(user: LoginIdentityDTO): Promise<import("./qrs/qrs.entity").QrsEntity[]>;
    crearEmpleado(empleado: CreateEmpleadoDTO): Promise<UsersEntity>;
    getById(id: number): Promise<UsersEntity>;
    actualizarEmpleado(empleadoId: number, empleado: UpdateEmpleadoDTO): Promise<UsersEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    deleteEmpleado(empleadoId: number): Promise<DeleteResult>;
}
