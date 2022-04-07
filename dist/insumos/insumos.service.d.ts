import { PaginationPrimeNgResult } from './../common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateInsumoDTO } from './DTOs/createInsumo.dto';
import { UpdateInsumoDTO } from './DTOs/updateInsumo.dto';
import { InsumoEntity } from './insumo.entity';
export declare class InsumosService {
    private readonly notFoundMessage;
    create(insumo: CreateInsumoDTO): Promise<InsumoEntity>;
    getById(id: number): Promise<InsumoEntity>;
    update(id: number, insumo: UpdateInsumoDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
