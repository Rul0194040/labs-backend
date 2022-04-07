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
var RulesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const loginIdentity_dto_1 = require("../../auth/dto/loginIdentity.dto");
const logger_1 = require("../../logger");
const profiles_enum_1 = require("../profiles.enum");
const users_service_1 = require("../users.service");
let RulesGuard = RulesGuard_1 = class RulesGuard {
    constructor(reflector, userService) {
        this.reflector = reflector;
        this.userService = userService;
        this.logger = new logger_1.MyLogger(RulesGuard_1.name);
    }
    async canActivate(context) {
        const ruleRequiredInMethod = this.reflector.get('require-rule', context.getHandler());
        if (!ruleRequiredInMethod) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user.profile === profiles_enum_1.ProfileTypes.SUPER) {
            return true;
        }
        if (ruleRequiredInMethod && user.grabandoRules) {
            const resultGrabar = await this.userService.grabarRule(ruleRequiredInMethod, user.id);
            this.logger.log(`Grabar rule [${ruleRequiredInMethod}] para el usuario [${user.firstName} ${user.lastName}]: ${resultGrabar}`);
            return true;
        }
        return user.rules.indexOf(ruleRequiredInMethod) > -1;
    }
};
RulesGuard = RulesGuard_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector,
        users_service_1.UsersService])
], RulesGuard);
exports.RulesGuard = RulesGuard;
//# sourceMappingURL=rules.guard.js.map