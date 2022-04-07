import { PuestosDepartamentosService } from '../puestos-departamentos.service';
import { CreateDepartamentoDTO } from '../DTOs/create-departamento.dto';
import { UpdateDepartamentoDTO } from '../DTOs/update-departamento.dto';
import { DepartamentoEntity } from '../entity/departamento.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PaginationOptions } from '../../../common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class DepartamentosController {
    private readonly puestosDepartamentosService;
    constructor(puestosDepartamentosService: PuestosDepartamentosService);
    crearDepartamento(departamento: CreateDepartamentoDTO): Promise<DepartamentoEntity>;
    getById(id: number): Promise<DepartamentoEntity>;
    actualizarDepartamento(departamentoId: number, departamento: UpdateDepartamentoDTO): Promise<UpdateResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    delete(departamentoId: number): Promise<DeleteResult>;
}
