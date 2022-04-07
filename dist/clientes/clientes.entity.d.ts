import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { TiposConvenios } from '@sanfrancisco/common/enum/tipos-convenios.enum';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class ClienteEntity extends CommonEntity {
    tipoPersona: string;
    nombre: string;
    descripcion: string;
    telefono: string;
    email: string;
    diasCredito: number;
    descuento: number;
    tipoConvenio: TiposConvenios;
    codigo: string;
    cuentaPxLab: string;
    fechaNacimiento: Date;
    fechaNac: Date;
    usuario: UsersEntity;
    usuarioId: number;
    stripeId: string;
}
