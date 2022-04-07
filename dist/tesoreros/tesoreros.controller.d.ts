import { FaltanteDTO } from './cortesTesorero/faltante.dto';
import { TesorerosService } from './tesoreros.service';
import { VentaEntity } from '../ventas/ventas.entity';
import { VentasService } from '../ventas/ventas.service';
import { UpdateResult } from 'typeorm';
import { EstadosCancelacionVenta } from '@sanfrancisco/ventas/estadosCancelacion.enum';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { UsersEntity } from '../users/users.entity';
import { MovimientoCajaEntity } from '@sanfrancisco/cajas/movimientos-caja.entity';
import { EstatusMovimientoCancelacionE } from '../cajas/estatusMovimiento.enum';
import { CajasService } from '../cajas/cajas.service';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '../common/DTO/pagination-prime-Ng-result.dto';
export declare class TesorerosController {
    private readonly tesorerosService;
    private readonly ventasService;
    private readonly cajasService;
    constructor(tesorerosService: TesorerosService, ventasService: VentasService, cajasService: CajasService);
    verSolicitudesCancelacion(): Promise<VentaEntity[]>;
    verVentasCanceladas(): Promise<VentaEntity[]>;
    cancelarVenta(ventaId: number, estatusCancelacion: EstadosCancelacionVenta, user: UsersEntity): Promise<UpdateResult>;
    obtenerCajasActivas(user: LoginIdentityDTO, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    movimientosSolicitudCancelacion(): Promise<MovimientoCajaEntity[]>;
    cancelarMovimiento(movimientoId: number, estatusCancelacion: EstatusMovimientoCancelacionE): Promise<CajaEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    finalizarCorte(corteId: number): Promise<UpdateResult>;
    patchFaltante(cajaId: number, data: FaltanteDTO): Promise<UpdateResult>;
}
