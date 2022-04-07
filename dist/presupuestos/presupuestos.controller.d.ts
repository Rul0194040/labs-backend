import { PresupuestoDetalleEntity } from './presupuestosDetalle.entity';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { UpdatePresupuestoDTO } from './DTO/update-presupuesto.dto';
import { HttpStatus } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { CreatePresupuestoDTO } from './DTO/create-presupuesto.dto';
import { PresupuestosService } from './presupuestos.service';
import { InformePresupuestoDTO } from './DTO/informe-presupuesto.dto';
import { EstatusPresupuesto } from './EstatusPresupuesto.enum';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Response } from 'express';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
export declare class PresupuestosController {
    private readonly presupuestoServices;
    private readonly heimalService;
    constructor(presupuestoServices: PresupuestosService, heimalService: HeimdalService);
    create(presupuesto: CreatePresupuestoDTO, user: LoginIdentityDTO): Promise<InformePresupuestoDTO>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    UpdateInsumoDetalle(id: number, presupuesto: UpdatePresupuestoDTO): Promise<PresupuestoDetalleEntity>;
    getById(id: number): Promise<InformePresupuestoDTO>;
    update(id: number, presupuesto: UpdatePresupuestoDTO): Promise<UpdateResult>;
    updateStatus(id: number, estatus: EstatusPresupuesto): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    EnviarCompra(idPresupuesto: number, proveedorSeleccionadoId: number): Promise<HttpStatus>;
    sendPres(res: Response, id: number, proveedorSeleccionadoId: number): Promise<void>;
}
