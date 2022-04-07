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
exports.DocumentosController = void 0;
const common_1 = require("@nestjs/common");
const documentos_service_1 = require("./documentos.service");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const create_documento_dto_1 = require("./Dtos/create-documento.dto");
const update_documento_dto_1 = require("./Dtos/update-documento.dto");
let DocumentosController = class DocumentosController {
    constructor(documentoService) {
        this.documentoService = documentoService;
    }
    create(documento) {
        return this.documentoService.create(documento);
    }
    paginate(options) {
        return this.documentoService.paginate(options);
    }
    getById(id) {
        return this.documentoService.getById(id);
    }
    update(id, documento) {
        return this.documentoService.update(id, documento);
    }
    delete(id) {
        return this.documentoService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_documento_dto_1.CreateDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_documento_dto_1.UpdateDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "delete", null);
DocumentosController = __decorate([
    common_1.Controller('documemntos'),
    __metadata("design:paramtypes", [documentos_service_1.DocumentosService])
], DocumentosController);
exports.DocumentosController = DocumentosController;
//# sourceMappingURL=documentos.controller.js.map