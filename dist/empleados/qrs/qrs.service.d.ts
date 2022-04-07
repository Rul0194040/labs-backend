import { QrsEntity } from './qrs.entity';
export declare class QrsService {
    generarQr(sucursalId: any): Promise<QrsEntity>;
    quemarQr(uuid: string, empleadoId: number, entrada: QrsEntity, lat: string, lng: string): Promise<QrsEntity>;
    getByUuid(uuid: string): Promise<QrsEntity>;
}
