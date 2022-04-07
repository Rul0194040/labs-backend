import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class ReportesVentasService {
    getServiciosVentas(options: PaginationOptions, sucursalId: number): Promise<PaginationPrimeNgResult>;
    serviciosVentasXLS(filter: string, sucursalId: number): Promise<Uint8Array>;
    paginateIngresos(options: PaginationOptions, sucursalId: number): Promise<PaginationPrimeNgResult>;
    getIngresosBySucursalXLS(filter: string, sucursalId: number): Promise<Uint8Array>;
    paginateVentasBySucursal(options: PaginationOptions, sucursalId: number): Promise<PaginationPrimeNgResult>;
    getVentasBySucursalXLS(filter: string, sucursalId: number): Promise<Uint8Array>;
    reporteVentasPeriodoJson(inicio: string, fin: string): Promise<any>;
    reporteVentasPeriodoXls(inicio: string, fin: string): Promise<Uint8Array>;
}
