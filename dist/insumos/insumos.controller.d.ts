import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateInsumoDTO } from './DTOs/createInsumo.dto';
import { UpdateInsumoDTO } from './DTOs/updateInsumo.dto';
import { InsumoEntity } from './insumo.entity';
import { InsumosService } from './insumos.service';
export declare class InsumosController {
    private readonly insumosService;
    constructor(insumosService: InsumosService);
    create(insumo: CreateInsumoDTO): Promise<InsumoEntity>;
    paginate(options: PaginationOptions): Promise<any>;
    getById(id: number): Promise<InsumoEntity>;
    update(id: number, sucursal: UpdateInsumoDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
