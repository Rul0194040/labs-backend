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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeChargeDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class StripeChargeDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.Min(10),
    class_validator_1.Max(999999.99),
    __metadata("design:type", Number)
], StripeChargeDTO.prototype, "amount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsIn(['usd', 'mxn']),
    __metadata("design:type", String)
], StripeChargeDTO.prototype, "currency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], StripeChargeDTO.prototype, "source", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], StripeChargeDTO.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], StripeChargeDTO.prototype, "metadata", void 0);
exports.StripeChargeDTO = StripeChargeDTO;
//# sourceMappingURL=stripeCharge.dto.js.map