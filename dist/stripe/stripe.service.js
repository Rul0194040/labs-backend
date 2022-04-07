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
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("../logger");
const nestjs_stripe_1 = require("nestjs-stripe");
const stripe_1 = require("stripe");
let StripeService = StripeService_1 = class StripeService {
    constructor(stripeClient) {
        this.stripeClient = stripeClient;
        this.logger = new logger_1.MyLogger(StripeService_1.name);
    }
    async createCustomer(customerToCreate) {
        const existingCustomer = await this.stripeClient.customers.list({
            email: customerToCreate.email,
            limit: 1,
        });
        if (existingCustomer.data.length) {
            this.logger.verbose('createCustomer->Customer already exists:');
            this.logger.verbose(JSON.stringify(existingCustomer.data[0]));
            throw new common_1.HttpException('El cliente ya existe en stripe.', common_1.HttpStatus.CONFLICT);
        }
        const createdCustomer = await this.stripeClient.customers.create(customerToCreate);
        this.logger.verbose('Customer created:');
        this.logger.verbose(JSON.stringify(createdCustomer));
        return createdCustomer;
    }
    getCustomer(stripeId) {
        return this.stripeClient.customers.retrieve(stripeId);
    }
    async getCustomers() {
        return this.stripeClient.customers.list({
            limit: 0,
        });
    }
    async createCharge(stripeId, charge) {
        return this.stripeClient.charges.create(Object.assign(Object.assign({}, charge), { customer: stripeId }));
    }
};
StripeService = StripeService_1 = __decorate([
    common_1.Injectable(),
    __param(0, nestjs_stripe_1.InjectStripe()),
    __metadata("design:paramtypes", [stripe_1.default])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map