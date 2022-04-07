import { EventEmitter2 } from '@nestjs/event-emitter';
import { PxlabService } from './pxlab.service';
export declare class PxlabController {
    private readonly pxService;
    private readonly eventEmitter;
    private logger;
    constructor(pxService: PxlabService, eventEmitter: EventEmitter2);
    uploadEstudio(file: any): Promise<any>;
}
