import { TiposUnidadesService } from './tipos-unidades.service';
import { createTiposUnidadesDTO } from './DTOs/createTiposUnidades.dto';
import { TipoUnidadEntity } from './tipos-unidades.entity';
import { UpdateTiposUnidadesDTO } from './DTOs/updateTiposUnidades.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class TiposUnidadesController {
    private readonly tiposUnidadesService;
    constructor(tiposUnidadesService: TiposUnidadesService);
    create(tipo: createTiposUnidadesDTO): Promise<TipoUnidadEntity>;
    getById(id: number): Promise<TipoUnidadEntity>;
    update(id: number, tipo: UpdateTiposUnidadesDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: any): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<any>;
}
