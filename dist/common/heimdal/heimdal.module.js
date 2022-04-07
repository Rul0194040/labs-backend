"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeimdalModule = void 0;
const common_1 = require("@nestjs/common");
const heimdal_service_1 = require("./heimdal.service");
const heimdal_controller_1 = require("./heimdal.controller");
let HeimdalModule = class HeimdalModule {
};
HeimdalModule = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [heimdal_service_1.HeimdalService],
        controllers: [heimdal_controller_1.HeimdalController],
    })
], HeimdalModule);
exports.HeimdalModule = HeimdalModule;
//# sourceMappingURL=heimdal.module.js.map