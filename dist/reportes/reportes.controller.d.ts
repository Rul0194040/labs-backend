import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { ReportesService } from './reportes.service';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { Response } from 'express';
import { ReportesVentasService } from './reportes-ventas.service';
export declare class ReportesController {
    private readonly reportesService;
    private readonly reportesVentasService;
    constructor(reportesService: ReportesService, reportesVentasService: ReportesVentasService);
    reporteVentas(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    reporteAdeudos(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    filtroMovimientos(filter: string, res: Response): Promise<void>;
    filtroInsumos(sucursalId: number, res: Response): Promise<void>;
    filtromovimiento(movimientoId: number, res: Response): Promise<void>;
    ReportesVentasService(sucursalId: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    serviciosVentasXLS(sucursalId: number, filter: string, res: Response): Promise<void>;
    reporte(inicio: string, fin: string): Promise<any>;
    reporteXls(inicio: string, fin: string, res: Response): Promise<void>;
    filtroIngresos(sucursalId: number, filter: string, res: Response): Promise<void>;
    paginateIngresos(options: PaginationOptions, sucursalId: number): Promise<any>;
    paginateVentasBySucursal(options: PaginationOptions, sucursalId: number): Promise<any>;
    filtroVentasBySucursal(sucursalId: number, filter: string, res: Response): Promise<void>;
}
