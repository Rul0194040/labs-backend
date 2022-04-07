"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PxlabController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PxlabController = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const apikey_guard_1 = require("../auth/guards/apikey/apikey.guard");
const logger_1 = require("../logger");
const ventas_entity_1 = require("../ventas/ventas.entity");
const fs_1 = require("fs");
const multer_1 = require("multer");
const typeorm_1 = require("typeorm");
const pxlab_service_1 = require("./pxlab.service");
let PxlabController = PxlabController_1 = class PxlabController {
    constructor(pxService, eventEmitter) {
        this.pxService = pxService;
        this.eventEmitter = eventEmitter;
        this.logger = new logger_1.MyLogger(PxlabController_1.name);
    }
    async uploadEstudio(file) {
        const folioPx = file.filename.split('.')[0];
        this.logger.verbose('Recibido pdf pxlab: ' + folioPx);
        return typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ estudioPx: true })
            .where('folioPxLab=:folio', { folio: folioPx })
            .execute();
        return file;
    }
};
__decorate([
    common_1.Post('pdf'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('archivo', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['application/pdf'];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                file.originalname.split('.').reverse()[0] === 'PDF') {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente "application/pdf".'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/pxlab';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
            filename: (req, file, cb) => {
                const fileNameDest = file.originalname;
                cb(null, fileNameDest);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PxlabController.prototype, "uploadEstudio", null);
PxlabController = PxlabController_1 = __decorate([
    swagger_1.ApiTags('pxlab'),
    common_1.Controller('pxlab'),
    common_1.UseGuards(apikey_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [pxlab_service_1.PxlabService,
        event_emitter_1.EventEmitter2])
], PxlabController);
exports.PxlabController = PxlabController;
//# sourceMappingURL=pxlab.controller.js.map