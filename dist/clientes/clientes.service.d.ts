import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ClienteEntity } from './clientes.entity';
import { CreateClienteDTO } from './DTOs/create-cliente.dto';
import { UpdateClienteDTO } from './DTOs/update-cliente.dto';
import { UsersEntity } from '../users/users.entity';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
export declare class ClientesService {
    private readonly pxService;
    constructor(pxService: PxlabService);
    private logger;
    create(cliente: CreateClienteDTO, user: UsersEntity): Promise<ClienteEntity>;
    getById(id: number): Promise<ClienteEntity>;
    update(id: number, cliente: UpdateClienteDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    updateStripeId(clienteId: number, stripeId: string): Promise<UpdateResult>;
    importarClientesXLS(xlsFile: string): Promise<any>;
}
