import { SucursalesInsumosService } from './services/sucursalesInsumos.service';
import { LoginIdentityDTO } from './../auth/dto/loginIdentity.dto';
import { CreateSucursalDTO } from './dto/createSucursal.dto';
import { SucursalesService } from './services/sucursales.service';
import { UpdateSucursalDTO } from './dto/updateSucursal.dto';
import { SucursalEntity } from './sucursal.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { SucursalesInsumosEntity } from './sucursalesInsumos.entity';
import { CreateSucursalesInsumosDTO } from './dto/createSucursalInsumo.dto';
import { UpdateSucursalesInsumosDTO } from './dto/updateSucursalInsumo.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { AlmacenService } from '../almacen/almacen.service';
import { MovimientosAlmacenEntity } from '@sanfrancisco/almacen/movimientosAlmacen.entity';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { Response } from 'express';
import { CreateApiKeyDTO } from './dto/createApiKey.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class SucursalesController {
    private readonly sucursalesService;
    private readonly sucursalesInsumosService;
    private readonly almacenService;
    private readonly heimalService;
    constructor(sucursalesService: SucursalesService, sucursalesInsumosService: SucursalesInsumosService, almacenService: AlmacenService, heimalService: HeimdalService);
    asegurarApiKeys(): Promise<import("./api-keys.entity").ApiKeyEntity[]>;
    create(sucursal: CreateSucursalDTO): Promise<SucursalEntity>;
    paginate(options: PaginationOptions): Promise<any>;
    paginateMinimosMatriz(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    paginateRecibidosMatriz(options: PaginationOptions, user: LoginIdentityDTO): Promise<PaginationPrimeNgResult>;
    paginateTransito(options: PaginationOptions, user: LoginIdentityDTO): Promise<PaginationPrimeNgResult>;
    paginateTransitoParcial(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<SucursalEntity>;
    getSucursalMatriz(): Promise<SucursalEntity>;
    update(id: number, sucursal: UpdateSucursalDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    tranferir(idDestino: number, idOrigen: number, insumoData: CreateSucursalesInsumosDTO): Promise<SucursalesInsumosEntity | UpdateResult>;
    updateSucursalInsumo(data: UpdateSucursalesInsumosDTO, idSucursal: number, idInsumo: number): Promise<UpdateResult>;
    cancelarTransferencia(movimientoId: number): Promise<UpdateResult>;
    paginateInsumosBySucursal(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    paginateInsumosBySucursalSinExistencia(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    arqueo(res: Response, id: number): Promise<void>;
    paginateInsumosByTipoInsumo(tipoInsumoId: number): Promise<SucursalesInsumosEntity[]>;
    getUsersBySucursal(idSucursal: number): Promise<Partial<UsersEntity>[]>;
    getAlmacenesBySucursal(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getAlmacenesTransferenciaBySucursal(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    verificarTransferencia(data: any): Promise<MovimientosAlmacenEntity>;
    insumosExistentesPaginate(): Promise<SucursalesInsumosEntity[]>;
    insumosExistentesBySucursalPaginate(idSucursal: number): Promise<any>;
    insumosExistentesByRequisicion(movimientoId: number): Promise<any>;
    sucursales(res: Response): Promise<void>;
    uploadMinimos(file: any): Promise<any>;
    updateInsumosSucursal(file: any, sucursalId: number): Promise<any>;
    updateInsumosTodas(file: any): Promise<any>;
    agergarApiKey(datos: CreateApiKeyDTO, sucursalId: number): Promise<any>;
    desactivarApiKey(apiKey: string, status: boolean): Promise<any>;
    renombrarApiKey(datos: CreateApiKeyDTO, apiKey: string): Promise<any>;
    calculoMinMaxMatriz(): Promise<{
        insumo: number;
        minimo: number;
        maximo: number;
    }[]>;
    importarMinMaxSucursal(file: any, sucursalId: number): Promise<any>;
}