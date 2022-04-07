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
exports.MuestrasController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt/jwt-auth.guard");
const user_decorator_1 = require("../../users/decorators/user.decorator");
const users_entity_1 = require("../../users/users.entity");
const muestras_service_1 = require("./muestras.service");
const create_muestra_dto_1 = require("./DTOs/create-muestra.dto");
let MuestrasController = class MuestrasController {
    constructor(muestrasService) {
        this.muestrasService = muestrasService;
    }
    create(user, data) {
        return this.muestrasService.create(user, data);
    }
    update(id) {
        return this.muestrasService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UsersEntity,
        create_muestra_dto_1.CreateMuestraDTO]),
    __metadata("design:returntype", Promise)
], MuestrasController.prototype, "create", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MuestrasController.prototype, "update", null);
MuestrasController = __decorate([
    common_1.Controller('muestras'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [muestras_service_1.MuestrasService])
], MuestrasController);
exports.MuestrasController = MuestrasController;
//# sourceMappingURL=muestras.controller.js.map