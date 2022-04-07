import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TipoUnidadEntity } from './tipos-unidades.entity';
import { UpdateTiposUnidadesDTO } from './DTOs/updateTiposUnidades.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { createTiposUnidadesDTO } from './DTOs/createTiposUnidades.dto';
export declare class TiposUnidadesService {
    private readonly notFoundMessage;
    create(tipounidad: createTiposUnidadesDTO): Promise<TipoUnidadEntity>;
    getById(id: number): Promise<TipoUnidadEntity>;
    update(id: number, tipo: UpdateTiposUnidadesDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
