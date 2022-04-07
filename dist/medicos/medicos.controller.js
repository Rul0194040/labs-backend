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
exports.MedicosController = void 0;
const common_1 = require("@nestjs/common");
const medicos_service_1 = require("./medicos.service");
const create_medico_dto_1 = require("./DTO/create-medico.dto");
const update_medico_dto_1 = require("./DTO/update-medico.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
let MedicosController = class MedicosController {
    constructor(medicosService) {
        this.medicosService = medicosService;
    }
    create(createMedicoDto) {
        return this.medicosService.create(createMedicoDto);
    }
    getById(id) {
        return this.medicosService.getById(id);
    }
    update(id, updateMedicoDto) {
        return this.medicosService.update(id, updateMedicoDto);
    }
    delete(id) {
        return this.medicosService.delete(id);
    }
    paginate(options) {
        return this.medicosService.paginate(options);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:medicos'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medico_dto_1.CreateMedicoDto]),
    __metadata("design:returntype", Promise)
], MedicosController.prototype, "create", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:medicos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:medicos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_medico_dto_1.UpdateMedicoDto]),
    __metadata("design:returntype", Promise)
], MedicosController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:medicos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicosController.prototype, "delete", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:medicos'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], MedicosController.prototype, "paginate", null);
MedicosController = __decorate([
    common_1.Controller('medicos'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [medicos_service_1.MedicosService])
], MedicosController);
exports.MedicosController = MedicosController;
//# sourceMappingURL=medicos.controller.js.map