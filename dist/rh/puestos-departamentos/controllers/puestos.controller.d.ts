import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreatePuestoDTO } from '../DTOs/create-puesto.dto';
import { UpdatePuestoDTO } from '../DTOs/update-puesto.dto';
import { PuestoEntity } from '../entity/puesto.entity';
import { PuestosDepartamentosService } from '../puestos-departamentos.service';
import { PaginationPrimeNgResult } from '../../../common/DTO/pagination-prime-Ng-result.dto';
export declare class PuestosController {
    private readonly puestosDepartamentosService;
    constructor(puestosDepartamentosService: PuestosDepartamentosService);
    crearPuesto(puesto: CreatePuestoDTO): Promise<PuestoEntity>;
    getById(id: number): Promise<PuestoEntity>;
    actualizarPuesto(puestoId: number, puesto: UpdatePuestoDTO): Promise<UpdateResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    delete(id: number): Promise<DeleteResult>;
}
