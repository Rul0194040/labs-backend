"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyslogService = void 0;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const syslog_entity_1 = require("./syslog.entity");
let SyslogService = class SyslogService {
    async log(data) {
        let user;
        let newLog = new syslog_entity_1.SyslogEntity();
        newLog = Object.assign({ newLog }, data);
        if (data.user) {
            user = Object.assign({ user }, data.user);
            newLog.user = user;
        }
        return typeorm_1.getRepository(syslog_entity_1.SyslogEntity).save(newLog);
    }
};
SyslogService = __decorate([
    common_1.Injectable()
], SyslogService);
exports.SyslogService = SyslogService;
//# sourceMappingURL=syslog.service.js.map