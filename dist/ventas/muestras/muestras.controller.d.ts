import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { MuestrasService } from './muestras.service';
import { CreateMuestraDTO } from './DTOs/create-muestra.dto';
import { MuestraEntity } from './muestras.entity';
import { DeleteResult } from 'typeorm';
export declare class MuestrasController {
    private readonly muestrasService;
    constructor(muestrasService: MuestrasService);
    create(user: UsersEntity, data: CreateMuestraDTO): Promise<MuestraEntity>;
    update(id: number): Promise<DeleteResult>;
}
