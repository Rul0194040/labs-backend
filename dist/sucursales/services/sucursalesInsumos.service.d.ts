import { PaginationPrimeNgResult } from '../../common/DTO/pagination-prime-Ng-result.dto';
import { UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { SucursalesInsumosEntity } from '../sucursalesInsumos.entity';
import { CreateSucursalesInsumosDTO } from '../dto/createSucursalInsumo.dto';
import { UpdateSucursalesInsumosDTO } from '../dto/updateSucursalInsumo.dto';
import { CreateMovimientoDTO } from '@sanfrancisco/almacen/DTOs/create-movimiento.dto';
import { MovimientosAlmacenEntity } from '../../almacen/movimientosAlmacen.entity';
import { NotificacionesService } from '@sanfrancisco/notificaciones/notificaciones.service';
export declare class SucursalesInsumosService {
    private readonly notificacionesService;
    constructor(notificacionesService: NotificacionesService);
    private readonly notFoundMessage;
    private readonly logger;
    transferencia(destinoId: number, origenId: number, insumoData: CreateSucursalesInsumosDTO): Promise<any>;
    cancelarTransferencia(movimientoId: number): Promise<UpdateResult>;
    verificarTransferencia(movimiento: CreateMovimientoDTO, detalle: any[]): Promise<MovimientosAlmacenEntity>;
    updateMinMaxSucursalInsumo(data: UpdateSucursalesInsumosDTO, idSucursal: number, idInsumo: number): Promise<UpdateResult>;
    paginateInsumosBySucursalSinExistencias(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    paginateInsumosBySucursal(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    minimosBytipoInsumo(tipoInsumoId: number): Promise<SucursalesInsumosEntity[]>;
    insumosExistentes(): Promise<SucursalesInsumosEntity[]>;
    paginateMinimosMatriz(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    insumosExistentesBySucursal(idSucursal: number): Promise<any>;
    altaInsumo(id: number, insumoData: CreateSucursalesInsumosDTO): Promise<SucursalesInsumosEntity | UpdateResult>;
    bajaInsumo(idSucursal: number, data: CreateSucursalesInsumosDTO): Promise<UpdateResult>;
    procesarMinimosMaximos(xlsFile: string): Promise<any>;
    importarInsumosSucursal(xlsFile: string, sucursalId: number): Promise<any>;
    importarInsumosTodas(xlsFile: string): Promise<any>;
    importarMinMaxSucursal(xlsFile: string, sucursalId: number): Promise<any>;
    calcularMinimosMaximosMatriz(): Promise<{
        insumo: number;
        minimo: number;
        maximo: number;
    }[]>;
}
