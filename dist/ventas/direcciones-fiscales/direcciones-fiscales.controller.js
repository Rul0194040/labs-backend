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
exports.DireccionesFiscalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt/jwt-auth.guard");
const require_rule_decorator_1 = require("../../users/decorators/require-rule.decorator");
const direcciones_fiscales_service_1 = require("./direcciones-fiscales.service");
const create_direcciones_fiscales_dto_1 = require("./DTOs/create-direcciones-fiscales.dto");
const update_direcciones_fiscales_dto_1 = require("./DTOs/update-direcciones-fiscales.dto");
let DireccionesFiscalesController = class DireccionesFiscalesController {
    constructor(direccionesFiscalesService) {
        this.direccionesFiscalesService = direccionesFiscalesService;
    }
    create(direccion) {
        return this.direccionesFiscalesService.create(direccion);
    }
    getById(id) {
        return this.direccionesFiscalesService.getById(id);
    }
    getDireccionesPaciente(id) {
        return this.direccionesFiscalesService.getDirecciones(false, id);
    }
    getDireccionesCliente(id) {
        return this.direccionesFiscalesService.getDirecciones(true, id);
    }
    update(id, direccion) {
        return this.direccionesFiscalesService.update(id, direccion);
    }
    delete(id) {
        return this.direccionesFiscalesService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:direccion'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_direcciones_fiscales_dto_1.CreateDireccionDTO]),
    __metadata("design:returntype", Promise)
], DireccionesFiscalesController.prototype, "create", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:direcciones'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DireccionesFiscalesController.prototype, "getById", null);
__decorate([
    common_1.Get('paciente/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DireccionesFiscalesController.prototype, "getDireccionesPaciente", null);
__decorate([
    common_1.Get('cliente/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DireccionesFiscalesController.prototype, "getDireccionesCliente", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:direcciones'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_direcciones_fiscales_dto_1.UpdateDireccionDTO]),
    __metadata("design:returntype", Promise)
], DireccionesFiscalesController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:direcciones'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DireccionesFiscalesController.prototype, "delete", null);
DireccionesFiscalesController = __decorate([
    swagger_1.ApiTags('direcciones-fiscales'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('direcciones-fiscales'),
    __metadata("design:paramtypes", [direcciones_fiscales_service_1.DireccionesFiscalesService])
], DireccionesFiscalesController);
exports.DireccionesFiscalesController = DireccionesFiscalesController;
//# sourceMappingURL=direcciones-fiscales.controller.js.map