import { CreateClienteDTO } from './DTOs/create-cliente.dto';
import { ClientesService } from './clientes.service';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateClienteDTO } from './DTOs/update-cliente.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { ClienteEntity } from './clientes.entity';
import { UsersEntity } from '../users/users.entity';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(cliente: CreateClienteDTO, user: UsersEntity): Promise<ClienteEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<ClienteEntity>;
    update(id: number, cliente: UpdateClienteDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    importarClientesXLS(file: any): Promise<any>;
}
