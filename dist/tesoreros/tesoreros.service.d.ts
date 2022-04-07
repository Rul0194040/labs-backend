import { CajasService } from './../cajas/cajas.service';
import { UpdateResult } from 'typeorm';
import { VentaEntity } from '../ventas/ventas.entity';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { MovimientoCajaEntity } from '@sanfrancisco/cajas/movimientos-caja.entity';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '../common/DTO/pagination-prime-Ng-result.dto';
import { FaltanteDTO } from './cortesTesorero/faltante.dto';
export declare class TesorerosService {
    private readonly cajaService;
    constructor(cajaService: CajasService);
    verSolicitudesCancelacion(): Promise<VentaEntity[]>;
    setObservaciones(cajaId: number, data: FaltanteDTO): Promise<UpdateResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    verVentasCanceladas(): Promise<VentaEntity[]>;
    obtenerCajasAbiertas(user: LoginIdentityDTO, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    movimientosSolicitudCancelacion(): Promise<MovimientoCajaEntity[]>;
    finalizarCorte(corteId: number): Promise<UpdateResult>;
}
