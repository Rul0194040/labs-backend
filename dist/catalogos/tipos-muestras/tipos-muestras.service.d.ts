import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateTipoMuestraDTO } from './DTOs/createTiposMuestras.dto';
import { TipoMuestraEntity } from './tipos-muestras.entity';
import { UpdateTipoMuestraDTO } from './DTOs/updateTiposMuestras.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class TiposMuestrasService {
    private readonly notFoundMessage;
    create(tipoMuestra: CreateTipoMuestraDTO): Promise<TipoMuestraEntity>;
    getById(id: number): Promise<TipoMuestraEntity>;
    update(id: number, tipo: UpdateTipoMuestraDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
