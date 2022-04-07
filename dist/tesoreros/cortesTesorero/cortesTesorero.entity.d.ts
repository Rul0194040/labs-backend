import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CommonEntity } from '../../common/commonEntity.abstract';
import { EstatusCorte } from './estatusCorte.enum';
export declare class CorteTesoreroEntity extends CommonEntity {
    cajas: CajaEntity;
    estatus: EstatusCorte;
    tesorero: UsersEntity;
    tesoreroId: number;
}
