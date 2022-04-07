import { PaginationPrimeNgResult } from '../../common/DTO/pagination-prime-Ng-result.dto';
import { CreateSucursalDTO } from '../dto/createSucursal.dto';
import { SucursalEntity } from '../sucursal.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSucursalDTO } from '../dto/updateSucursal.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { ApiKeyEntity } from '../api-keys.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class SucursalesService {
    private readonly notFoundMessage;
    create(sucursal: CreateSucursalDTO): Promise<SucursalEntity>;
    getById(id: number): Promise<SucursalEntity>;
    update(id: number, sucursal: UpdateSucursalDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getSucursalMatriz(): Promise<SucursalEntity>;
    getUsersBySucursal(idSucursal: number): Promise<Partial<UsersEntity>[]>;
    getByApiKey(apikey: string): Promise<SucursalEntity>;
    crearApiKey(sucursalId: number, nombre: string): Promise<ApiKeyEntity>;
    estatusApiKey(key: string, active: boolean): Promise<UpdateResult>;
    renameApiKey(key: string, nombre: string): Promise<UpdateResult>;
    asegurarApiKeys(): Promise<ApiKeyEntity[]>;
}
