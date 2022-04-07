import { AgregarPago } from './dtos/agregar-pago.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PagoEntity } from './pagos.entity';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { InformePagosDTO } from './dtos/informe-pagos.dto';
import { ReciboPagosDTO } from './dtos/recibo-pagos.dto';
import { VentaServiciosDTO } from '../ventas/DTOs/venta-servicios.dto';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { VentasService } from '@sanfrancisco/ventas/ventas.service';
export declare class PagosService {
    private readonly pxService;
    private readonly ventasService;
    constructor(pxService: PxlabService, ventasService: VentasService);
    create(pago: AgregarPago, user: LoginIdentityDTO): Promise<InformePagosDTO>;
    getById(id: number): Promise<PagoEntity>;
    delete(id: number): Promise<DeleteResult>;
    updateStatus(id: number, estatus: number): Promise<UpdateResult>;
    cancelacionPago(id: number, motivo: string): Promise<UpdateResult>;
    getReciboPagos(detalleVenta: VentaServiciosDTO, pagosId: number[]): Promise<ReciboPagosDTO>;
    abonarPagoCliente(clienteId: number, monto: number): Promise<UpdateResult>;
}
