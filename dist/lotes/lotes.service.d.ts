import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { CreateLoteDTO } from './DTOs/create-lote.dto';
import { LoteEntity } from './lotes.entity';
import { UpdateLoteDTO } from './DTOs/update-lote.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class LotesService {
    create(lote: CreateLoteDTO): Promise<LoteEntity>;
    getById(id: number): Promise<LoteEntity>;
    update(id: number, updateLote: UpdateLoteDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
