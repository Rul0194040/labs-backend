"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TareasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareasService = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("../logger");
let TareasService = TareasService_1 = class TareasService {
    constructor() {
        this.logger = new logger_1.MyLogger(TareasService_1.name);
    }
};
TareasService = TareasService_1 = __decorate([
    common_1.Injectable()
], TareasService);
exports.TareasService = TareasService;
//# sourceMappingURL=tareas.service.js.map