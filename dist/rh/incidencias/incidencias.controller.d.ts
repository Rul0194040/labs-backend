import { IncidenciasService } from './incidencias.service';
import { IncidenciaEntity } from './entity/incidencias.entity';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult } from 'typeorm';
import { CreateIncidenciaDTO } from './DTO/create-incidencia.dto';
import { UpdateIncidenciasDTO } from './DTO/update-incidencia.dto';
export declare class IncidenciasController {
    private readonly incidenciaService;
    constructor(incidenciaService: IncidenciasService);
    crearIncidencia(incidencia: CreateIncidenciaDTO): Promise<IncidenciaEntity>;
    getById(id: number): Promise<IncidenciaEntity>;
    actualizarIncidencia(incidenciaId: number, incidencia: UpdateIncidenciasDTO): Promise<IncidenciaEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    deleteIncidencia(incidenciaId: number): Promise<DeleteResult>;
}
