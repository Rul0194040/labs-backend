import { TiposMuestrasService } from './tipos-muestras.service';
import { CreateTipoMuestraDTO } from './DTOs/createTiposMuestras.dto';
import { TipoMuestraEntity } from './tipos-muestras.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateTipoMuestraDTO } from './DTOs/updateTiposMuestras.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class TiposMuestrasController {
    private readonly tiposMuestrasService;
    constructor(tiposMuestrasService: TiposMuestrasService);
    create(tipo: CreateTipoMuestraDTO): Promise<TipoMuestraEntity>;
    getById(id: number): Promise<TipoMuestraEntity>;
    update(id: number, tipo: UpdateTipoMuestraDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: any): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<any>;
}
