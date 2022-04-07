import { CreateDepartamentoDTO } from './DTOs/create-departamento.dto';
import { CreatePuestoDTO } from './DTOs/create-puesto.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { DepartamentoEntity } from './entity/departamento.entity';
import { PuestoEntity } from './entity/puesto.entity';
import { UpdateDepartamentoDTO } from './DTOs/update-departamento.dto';
import { UpdatePuestoDTO } from './DTOs/update-puesto.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class PuestosDepartamentosService {
    crearDepartamento(departamento: CreateDepartamentoDTO): Promise<DepartamentoEntity>;
    actualizarDepartamento(departamentoId: number, departamento: UpdateDepartamentoDTO): Promise<UpdateResult>;
    departamentosPaginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getDepartamentoById(id: number): Promise<DepartamentoEntity>;
    deleteDepartamento(departamentoId: number): Promise<DeleteResult>;
    crearPuesto(puesto: CreatePuestoDTO): Promise<PuestoEntity>;
    actualizarPuesto(puestoId: number, puesto: UpdatePuestoDTO): Promise<UpdateResult>;
    puestosPaginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getPuestoById(id: number): Promise<PuestoEntity>;
    puestosDelete(id: number): Promise<DeleteResult>;
}
