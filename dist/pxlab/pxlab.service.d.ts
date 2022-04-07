import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InformeFolioDTO } from '@sanfrancisco/ventas/DTOs/informe-folio.dto';
import { TareasEntity } from './tareas.entity';
export declare class PxlabService {
    private readonly configService;
    private readonly eventEmitter;
    private pxLabServiceURL;
    private logger;
    constructor(configService: ConfigService, eventEmitter: EventEmitter2);
    enviarVenta(venta: InformeFolioDTO, tipo?: string): Promise<TareasEntity[]>;
    enviarCliente(cuentaPxLab: string, nombre: string, email: string, esNuevo?: boolean): Promise<TareasEntity[]>;
    enviarEstudio(clave: string, nombre: string, esNuevo?: boolean): Promise<TareasEntity[]>;
}
