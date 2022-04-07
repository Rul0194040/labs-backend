import { RecibirDTO } from './DTO/recibirDatos.dto';
import { PaginateMovimientosCajaDTO } from './DTO/paginate-movimientos-caja.dto';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CajaEntity } from './cajas.entity';
import { CajasService } from './cajas.service';
import { CreateCajaDTO } from './DTO/create-caja.dto';
import { UpdateCajaDTO } from './DTO/update-caja.dto';
import { MovimientosCajaDTO } from './DTO/movimientos-caja.dto';
import { TotalMovimientosCajaDTO } from './DTO/total-movimientos-caja.dto';
import { CerrarCajaDTO } from './DTO/cerrar-caja.dto';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { Response } from 'express';
import { CambiarStatusMovimientoDTO } from './DTO/cambiarStatusMovimiento.dto';
import { MovimientoCajaEntity } from './movimientos-caja.entity';
import { CajasCerradasSucursalDTO } from './DTO/cajasCerradasSucursal.dto';
export declare class CajasController {
    private readonly cajasService;
    private readonly heimalService;
    constructor(cajasService: CajasService, heimalService: HeimdalService);
    create(caja: CreateCajaDTO, user: UsersEntity): Promise<CajaEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    paginatemovCaja(id: number, options: PaginateMovimientosCajaDTO): Promise<PaginationPrimeNgResult>;
    cancelacionesCaja(id: number): Promise<MovimientoCajaEntity[]>;
    retirosCaja(id: number): Promise<MovimientoCajaEntity[]>;
    depositosCaja(id: number): Promise<MovimientoCajaEntity[]>;
    solicitarCancelacion(idMovimiento: number, idCaja: number, cambiarStatus: CambiarStatusMovimientoDTO): Promise<MovimientoCajaEntity>;
    paginateUserCaja(options: PaginationOptions, user: LoginIdentityDTO): Promise<PaginationPrimeNgResult>;
    paginateventasCaja(user: LoginIdentityDTO, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<CajaEntity>;
    update(id: number, caja: UpdateCajaDTO): Promise<UpdateResult>;
    updateEntregada(id: number, datosCaja: RecibirDTO): Promise<UpdateResult>;
    updateContabilizada(id: number): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    consultarCaja(user: LoginIdentityDTO): Promise<CajaEntity | null>;
    crearDeposito(user: UsersEntity, depositoData: MovimientosCajaDTO): Promise<CajaEntity>;
    crearRetiro(user: UsersEntity, depositoData: MovimientosCajaDTO): Promise<CajaEntity>;
    getTotalMovimientosByCaja(user: UsersEntity): Promise<TotalMovimientosCajaDTO>;
    getCajasCerradasPorSucursal(sucursalId: number, user: LoginIdentityDTO): Promise<CajasCerradasSucursalDTO[]>;
    getCortePorCaja(cajaId: number): Promise<CajasCerradasSucursalDTO>;
    contabilizarCajas(sucursalId: number, user: LoginIdentityDTO): Promise<UpdateResult>;
    cerrarCaja(user: LoginIdentityDTO, caja: CerrarCajaDTO): Promise<UpdateResult>;
    arqueo(res: Response, id: number): Promise<void>;
}
