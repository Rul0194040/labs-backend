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
exports.SucursalesPublicController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const sucursales_service_1 = require("./services/sucursales.service");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const nestjs_rate_limiter_1 = require("nestjs-rate-limiter");
let SucursalesPublicController = class SucursalesPublicController {
    constructor(sucursalesService) {
        this.sucursalesService = sucursalesService;
    }
    paginate(options) {
        return this.sucursalesService.paginate(options);
    }
};
__decorate([
    common_1.Post('paginate'),
    nestjs_rate_limiter_1.RateLimit({
        keyPrefix: 'public/sucursales/paginate',
        points: 10,
        duration: 60,
        errorMessage: 'Límite de solicitudes excedido.',
    }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesPublicController.prototype, "paginate", null);
SucursalesPublicController = __decorate([
    swagger_1.ApiTags('public/sucursales'),
    common_1.Controller('public/sucursales'),
    __metadata("design:paramtypes", [sucursales_service_1.SucursalesService])
], SucursalesPublicController);
exports.SucursalesPublicController = SucursalesPublicController;
//# sourceMappingURL=sucursalesPublic.controller.js.map