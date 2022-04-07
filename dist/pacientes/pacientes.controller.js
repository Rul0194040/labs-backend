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
exports.PacientesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const user_decorator_1 = require("../users/decorators/user.decorator");
const create_paciente_dto_1 = require("./DTOs/create-paciente.dto");
const update_paciente_dto_1 = require("./DTOs/update-paciente.dto");
const pacientes_service_1 = require("./pacientes.service");
const users_entity_1 = require("../users/users.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
let PacientesController = class PacientesController {
    constructor(pacienteServie) {
        this.pacienteServie = pacienteServie;
    }
    create(paciente, user) {
        return this.pacienteServie.create(paciente, user);
    }
    paginate(options) {
        return this.pacienteServie.paginate(options);
    }
    getById(id) {
        return this.pacienteServie.getById(id);
    }
    update(id, paciente) {
        return this.pacienteServie.update(id, paciente);
    }
    updateStatus(id, status) {
        return this.pacienteServie.updateStatus(id, status);
    }
    delete(id) {
        return this.pacienteServie.delete(id);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:paciente'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_paciente_dto_1.CreatePacienteDTO,
        users_entity_1.UsersEntity]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:pacientes'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:pacientes'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:pacientes'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_paciente_dto_1.UpdatePacienteDTO]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    require_rule_decorator_1.RequireRule('update:pacientes'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:pacientes'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "delete", null);
PacientesController = __decorate([
    swagger_1.ApiTags('pacientes'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('pacientes'),
    __metadata("design:paramtypes", [pacientes_service_1.PacientesService])
], PacientesController);
exports.PacientesController = PacientesController;
//# sourceMappingURL=pacientes.controller.js.map