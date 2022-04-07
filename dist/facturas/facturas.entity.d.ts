import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { VentaEntity } from '../ventas/ventas.entity';
export declare class FacturaEntity extends CommonEntity {
    venta: VentaEntity;
    ventaId: number;
    contribuyente: string;
    persona: string;
    email: string;
    telefono: string;
    rfc: string;
    calle: string;
    numInt: string;
    numExt: string;
    colonia: string;
    cp: string;
    estado: string;
    municipio: string;
    pais: string;
    xml: string;
    pdf: string;
    descargado: boolean;
    fechaDescargado: Date;
    ipDescargado: string;
}
