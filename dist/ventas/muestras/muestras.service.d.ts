import { UsersEntity } from '../../users/users.entity';
import { CreateMuestraDTO } from './DTOs/create-muestra.dto';
import { DeleteResult } from 'typeorm';
import { MuestraEntity } from './muestras.entity';
export declare class MuestrasService {
    create(usuario: UsersEntity, data: CreateMuestraDTO): Promise<MuestraEntity>;
    delete(id: number): Promise<DeleteResult>;
}
