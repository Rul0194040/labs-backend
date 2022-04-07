import { ProveedoresService } from './proveedores.service';
import { UpdateProveedorDTO } from './DTOs/updateProveedor.dto';
import { PaginationOptions } from '../../common/DTO/paginationPrimeNg.dto';
import { CreateProveedorDTO } from './DTOs/createProveedor.dto';
import { ProveedorEntity } from './proveedores.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class ProveedoresController {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    GetById(id: number): Promise<ProveedorEntity>;
    create(data: CreateProveedorDTO): Promise<ProveedorEntity>;
    update(id: number, data: UpdateProveedorDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
