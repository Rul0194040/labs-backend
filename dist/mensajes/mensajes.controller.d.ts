import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { MensajeEntity } from './mensaje.entity';
import { MensajesService } from './mensajes.service';
export declare class MensajesController {
    private readonly mensajesService;
    constructor(mensajesService: MensajesService);
    abrirCoversacion(conQuienUuid: string, solicita: LoginIdentityDTO): Promise<MensajeEntity[]>;
}
