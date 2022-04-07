import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { PresupuestoEntity } from '@sanfrancisco/presupuestos/presupuesto.entity';
import { EstatusCompra } from './EstatusCompra.enum';
import { PagoProveedorEntity } from './pagosProveedores.entity';
export declare class CompraEntity extends CommonEntity {
    proveedor: ProveedorEntity;
    proveedorId: number;
    presupuesto: PresupuestoEntity;
    presupuestoId?: number;
    fecha: Date;
    folio: string;
    numCotizacion: number;
    descuento: number;
    estatus: EstatusCompra;
    total: number;
    saldo: number;
    conClave: boolean;
    pagado: boolean;
    credito: boolean;
    diasCredito: number;
    pathCotizacion: string;
    pagos: PagoProveedorEntity;
}
