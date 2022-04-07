import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateTipoInsumoDTO } from './DTOs/createTipoInsumo.dto';
import { UpdateTipoInsumoDTO } from './DTOs/updateTipoInsumo.dto';
import { TipoInsumoEntity } from './tipo-insumo.entity';
export declare class TiposInsumosService {
    private readonly notFoundMessage;
    create(tipoInsumo: CreateTipoInsumoDTO): Promise<TipoInsumoEntity>;
    getById(id: number): Promise<TipoInsumoEntity>;
    update(id: number, data: UpdateTipoInsumoDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
