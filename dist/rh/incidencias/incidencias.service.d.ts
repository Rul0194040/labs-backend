import { IncidenciaEntity } from './entity/incidencias.entity';
import { CreateIncidenciaDTO } from './DTO/create-incidencia.dto';
import { UpdateIncidenciasDTO } from './DTO/update-incidencia.dto';
import { DeleteResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class IncidenciasService {
    createIncidencia(incidencia: CreateIncidenciaDTO): Promise<IncidenciaEntity>;
    getIncidenciaById(id: number): Promise<IncidenciaEntity>;
    updateIncidencia(id: number, incidencia: UpdateIncidenciasDTO): Promise<IncidenciaEntity>;
    delete(id: number): Promise<DeleteResult>;
    incidenciasPaginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
