"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyslogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const profiles_enum_1 = require("../users/profiles.enum");
const require_profiles_decorator_1 = require("../users/decorators/require-profiles.decorator");
let SyslogController = class SyslogController {
};
SyslogController = __decorate([
    common_1.Controller('syslog'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('syslog'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SUPER, profiles_enum_1.ProfileTypes.SYSADMIN)
], SyslogController);
exports.SyslogController = SyslogController;
//# sourceMappingURL=syslog.controller.js.map