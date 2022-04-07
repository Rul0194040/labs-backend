import { PagosService } from './pagos.service';
import { AgregarPago } from './dtos/agregar-pago.dto';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { PagoEntity } from './pagos.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InformePagosDTO } from './dtos/informe-pagos.dto';
import { HeimdalService } from '../common/heimdal/heimdal.service';
import { ReciboPagosDTO } from './dtos/recibo-pagos.dto';
import { VentasService } from '../ventas/ventas.service';
export declare class PagosController {
    private readonly pagosService;
    private readonly ventasService;
    private readonly heimalService;
    constructor(pagosService: PagosService, ventasService: VentasService, heimalService: HeimdalService);
    create(pago: AgregarPago, user: LoginIdentityDTO): Promise<InformePagosDTO>;
    getById(id: number): Promise<PagoEntity>;
    delete(id: number): Promise<DeleteResult>;
    updateStatus(id: number, estatus: number): Promise<UpdateResult>;
    cancelacionPago(id: number, motivo: string): Promise<UpdateResult>;
    reciboPagos(ventaId: number, data: {
        pagosId: number[];
    }): Promise<ReciboPagosDTO>;
    abonarPagoCliente(clienteId: number, monto: number): Promise<UpdateResult>;
}
