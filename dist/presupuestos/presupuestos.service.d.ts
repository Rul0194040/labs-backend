import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { ConfigService } from '@nestjs/config';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { InformePresupuestoDTO } from './DTO/informe-presupuesto.dto';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { UpdatePresupuestoDTO } from './DTO/update-presupuesto.dto';
import { CreatePresupuestoDTO } from './DTO/create-presupuesto.dto';
import { HttpStatus } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PresupuestoDetalleEntity } from './presupuestosDetalle.entity';
import { EstatusPresupuesto } from './EstatusPresupuesto.enum';
export declare class PresupuestosService {
    private readonly heimalService;
    private readonly configService;
    private readonly mailSenderService;
    private readonly notFoundMessage;
    constructor(heimalService: HeimdalService, configService: ConfigService, mailSenderService: MailService);
    create(data: CreatePresupuestoDTO, user: LoginIdentityDTO): Promise<InformePresupuestoDTO>;
    getById(id: number): Promise<InformePresupuestoDTO>;
    sendToProveedor(id: number, proveedorSeleccionadoId: number): Promise<HttpStatus>;
    updateDetallePresupuesto(id: number, presupuesto: UpdatePresupuestoDTO): Promise<UpdateResult>;
    UpdateInsumoDetallePresupuesto(id: number, presupuesto: UpdatePresupuestoDTO): Promise<PresupuestoDetalleEntity>;
    updateStatus(id: number, estatus: EstatusPresupuesto): Promise<UpdateResult>;
    deletePresupuestoDetalle(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
