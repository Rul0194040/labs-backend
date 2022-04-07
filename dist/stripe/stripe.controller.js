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
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const clientes_entity_1 = require("../clientes/clientes.entity");
const clientes_service_1 = require("../clientes/clientes.service");
const stripeCharge_dto_1 = require("./dtos/stripeCharge.dto");
let StripeController = class StripeController {
    constructor(stripeService, clientesService) {
        this.stripeService = stripeService;
        this.clientesService = clientesService;
    }
    async createCustomer(customerId) {
        const clienteLabs = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne(customerId);
        if (!clienteLabs) {
            throw new common_1.HttpException('El cliente no existe en labs.', common_1.HttpStatus.NOT_FOUND);
        }
        const customerToCreate = {
            name: clienteLabs.nombre,
            email: clienteLabs.email,
            phone: clienteLabs.telefono,
            metadata: {
                labsId: clienteLabs.id,
            },
        };
        const stripeCustomer = await this.stripeService.createCustomer(customerToCreate);
        return this.clientesService.updateStripeId(clienteLabs.id, stripeCustomer.id);
    }
    async getCustomer(stripeId) {
        return this.stripeService.getCustomer(stripeId);
    }
    async getCustomers() {
        return this.stripeService.getCustomers();
    }
    async createCharge(stripeId, charge) {
        return this.stripeService.createCharge(stripeId, charge);
    }
};
__decorate([
    common_1.Post('customers'),
    __param(0, common_1.Body('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCustomer", null);
__decorate([
    common_1.Get('customers/:stripeId'),
    __param(0, common_1.Param('stripeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "getCustomer", null);
__decorate([
    common_1.Get('customers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "getCustomers", null);
__decorate([
    common_1.Put('customers/:stripeId/charge'),
    __param(0, common_1.Param('stripeId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stripeCharge_dto_1.StripeChargeDTO]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCharge", null);
StripeController = __decorate([
    swagger_1.ApiTags('stripe'),
    common_1.Controller('stripe'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        clientes_service_1.ClientesService])
], StripeController);
exports.StripeController = StripeController;
//# sourceMappingURL=stripe.controller.js.map