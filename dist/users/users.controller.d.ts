import { updateUserDTO } from './dto/updateUser.dto';
import { createUserDTO } from './dto/createUser.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { statusUserDTO } from './dto/statusUser.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(user: createUserDTO): Promise<UsersEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<UsersEntity>;
    update(id: number, data: updateUserDTO): Promise<UpdateResult>;
    statusById(id: number, status: statusUserDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    updatePassword(password: string, newPassword: string, user: LoginIdentityDTO): Promise<UpdateResult>;
    getProfiles(): Promise<{
        ALMACEN_GENERAL: import("./profiles.enum").ProfileTypes;
        TESORERO_SUCURSALES_CENTRALES: import("./profiles.enum").ProfileTypes;
        TESORERO_SUCURSALES_FORANEAS: import("./profiles.enum").ProfileTypes;
        COMPRAS: import("./profiles.enum").ProfileTypes;
        DIRECTIVOS: import("./profiles.enum").ProfileTypes;
        GERENTE_SUCURSALES: import("./profiles.enum").ProfileTypes;
        SUCURSAL: import("./profiles.enum").ProfileTypes;
        EMPLEADO: import("./profiles.enum").ProfileTypes;
    }>;
    getTiposEmpleados(): Promise<{
        GENERAL: import("./profiles.enum").PerfilTipoEmpleado;
        CAPTADOR: import("./profiles.enum").PerfilTipoEmpleado;
        MAQUILADOR: import("./profiles.enum").PerfilTipoEmpleado;
        VENDEDOR: import("./profiles.enum").PerfilTipoEmpleado;
    }>;
    agregarUsuarioSucursal(usuarioId: number, sucursalId: number): Promise<import("./userSucursales.entity").UserSucursalesEntity>;
    quitarUsuarioSucursal(usuarioId: number, sucursalId: number): Promise<DeleteResult>;
    obtenerSucursalesUsuario(usuarioId: number): Promise<Partial<import("../sucursales/sucursal.entity").SucursalEntity>[]>;
    finalizarGrabadoDeRoles(userSesion: LoginIdentityDTO): Promise<UpdateResult>;
    activarGrabadoDeRoles(usuarioId: number): Promise<UpdateResult>;
    desactivarGrabadoDeRoles(usuarioId: number): Promise<UpdateResult>;
    importarEmpleadosXLS(file: any): Promise<any>;
}
