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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeimdalController = void 0;
const common_1 = require("@nestjs/common");
const heimdal_service_1 = require("./heimdal.service");
let HeimdalController = class HeimdalController {
    constructor(heimalService) {
        this.heimalService = heimalService;
    }
    async pruebas(res) {
        const data = {
            ventas: [
                { cliente: 'Erik Corona' },
                { cliente: 'Esteban Sanchez' },
                { cliente: 'Raymundo Gómez' },
            ],
        };
        const buffer = await this.heimalService.render('test/pruebas', data);
        const outputFileName = 'salida.docx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async pruebasPdf(res) {
        const data = {
            ventas: [
                { cliente: 'Erik Corona' },
                { cliente: 'Esteban Sanchez' },
                { cliente: 'Raymundo Gómez' },
            ],
        };
        const buffer = await this.heimalService.render('test/pruebas', data, 'pdf');
        const outputFileName = 'salida.pdf';
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async pruebasXls(res) {
        const buffer = await this.heimalService.reporteUno();
        const outputFileName = 'salida.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
__decorate([
    common_1.Get('pruebas'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HeimdalController.prototype, "pruebas", null);
__decorate([
    common_1.Get('pruebaspdf'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HeimdalController.prototype, "pruebasPdf", null);
__decorate([
    common_1.Get('pruebasxls'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HeimdalController.prototype, "pruebasXls", null);
HeimdalController = __decorate([
    common_1.Controller('heimdal'),
    __metadata("design:paramtypes", [heimdal_service_1.HeimdalService])
], HeimdalController);
exports.HeimdalController = HeimdalController;
//# sourceMappingURL=heimdal.controller.js.map