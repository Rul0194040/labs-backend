import { RequisicionBySucursalDTO } from './DTOs/paginate-requisicion-sucursal.dto';
import { CreateInformeDTO } from './DTOs/create-informe.dto';
import { AlmacenService } from './almacen.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateMovimientoDTO } from './DTOs/update-movimiento.dto';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { Response } from 'express';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
export declare class AlmacenController {
    private readonly almacenService;
    private readonly heimalService;
    constructor(almacenService: AlmacenService, heimalService: HeimdalService);
    create(data: any, user: LoginIdentityDTO): Promise<CreateInformeDTO>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    paginateRequisicion(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    paginateRequisicionbySucursal(data: RequisicionBySucursalDTO, user: LoginIdentityDTO): Promise<PaginationPrimeNgResult>;
    paginateTransferencia(options: PaginationOptions, user: LoginIdentityDTO): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<CreateInformeDTO>;
    update(id: number, sucursal: UpdateMovimientoDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: string): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    filtroMovimientos(start: string, end: string, res: Response): Promise<void>;
    documento(res: Response, id: number): Promise<void>;
}
