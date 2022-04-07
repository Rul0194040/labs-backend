"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const images_service_1 = require("./../images/images.service");
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const email_service_1 = require("../common/services/mailer/email.service");
const avatar_controller_1 = require("./avatar/avatar.controller");
const avatar_public_controller_1 = require("./avatar/avatar.public.controller");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [],
        controllers: [users_controller_1.UsersController, avatar_controller_1.AvatarController, avatar_public_controller_1.AvatarPublicController],
        providers: [users_service_1.UsersService, email_service_1.MailService, images_service_1.ImagesService],
        exports: [users_service_1.UsersService, email_service_1.MailService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map