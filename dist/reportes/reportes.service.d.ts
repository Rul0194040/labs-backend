import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class ReportesService {
    reporteVentas(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    reporteVentasAdeudos(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getVentasXLS(filter: string): Promise<Uint8Array>;
    getInsumosBySucursalXLS(sucursalId: number): Promise<Uint8Array>;
    getMovimientoXLS(movimientoId: number): Promise<Uint8Array>;
}
