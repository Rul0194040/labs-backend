import { UpdateEmpleadoDTO } from './DTO/update-empleado.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CreateEmpleadoDTO } from './DTO/create-empleado.dto';
import { DeleteResult } from 'typeorm';
import { QrsEntity } from './qrs/qrs.entity';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class EmpleadosService {
    getEntradasSalidas(empleadoId: number): Promise<QrsEntity[]>;
    createEmpleado(empleado: CreateEmpleadoDTO): Promise<UsersEntity>;
    getEmpleadoById(id: number): Promise<UsersEntity>;
    updateEmpleado(id: number, empleado: UpdateEmpleadoDTO): Promise<UsersEntity>;
    delete(id: number): Promise<DeleteResult>;
    empleadosPaginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
