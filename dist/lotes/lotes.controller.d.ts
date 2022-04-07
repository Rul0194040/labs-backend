import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { LotesService } from './lotes.service';
import { CreateLoteDTO } from './DTOs/create-lote.dto';
import { UpdateLoteDTO } from './DTOs/update-lote.dto';
import { LoteEntity } from './lotes.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class LotesController {
    private readonly lotesService;
    constructor(lotesService: LotesService);
    create(lote: CreateLoteDTO): Promise<LoteEntity>;
    getById(id: number): Promise<LoteEntity>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    update(id: number, descripcion: UpdateLoteDTO): Promise<UpdateResult>;
}
