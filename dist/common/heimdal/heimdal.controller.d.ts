import { Response } from 'express';
import { HeimdalService } from './heimdal.service';
export declare class HeimdalController {
    private readonly heimalService;
    constructor(heimalService: HeimdalService);
    pruebas(res: Response): Promise<void>;
    pruebasPdf(res: Response): Promise<void>;
    pruebasXls(res: Response): Promise<void>;
}
