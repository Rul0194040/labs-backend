import { TipoInsumoEntity } from '@sanfrancisco/catalogos/tipos-insumos/tipo-insumo.entity';
import { TiposInsumosService } from './tipos-insumos.service';
import { CreateTipoInsumoDTO } from './DTOs/createTipoInsumo.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateTipoInsumoDTO } from './DTOs/updateTipoInsumo.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class TiposInsumosController {
    private readonly tipoInsumoService;
    constructor(tipoInsumoService: TiposInsumosService);
    create(tipo: CreateTipoInsumoDTO): Promise<TipoInsumoEntity>;
    paginate(options: PaginationOptions): Promise<any>;
    getById(id: number): Promise<TipoInsumoEntity>;
    update(id: number, grupo: UpdateTipoInsumoDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
