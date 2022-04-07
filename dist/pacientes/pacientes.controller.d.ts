import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreatePacienteDTO } from './DTOs/create-paciente.dto';
import { UpdatePacienteDTO } from './DTOs/update-paciente.dto';
import { PacienteEntity } from './pacientes.entity';
import { PacientesService } from './pacientes.service';
import { UsersEntity } from '../users/users.entity';
export declare class PacientesController {
    private readonly pacienteServie;
    constructor(pacienteServie: PacientesService);
    create(paciente: CreatePacienteDTO, user: UsersEntity): Promise<PacienteEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<PacienteEntity>;
    update(id: number, paciente: UpdatePacienteDTO): Promise<PacienteEntity>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
