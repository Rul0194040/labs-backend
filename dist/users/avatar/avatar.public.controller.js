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
exports.AvatarPublicController = void 0;
const images_service_1 = require("./../../images/images.service");
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const users_service_1 = require("../users.service");
let AvatarPublicController = class AvatarPublicController {
    constructor(usersService, imagesService) {
        this.usersService = usersService;
        this.imagesService = imagesService;
    }
    serveAvatar(uuid, res) {
        const image = `${uuid}.jpg`;
        const filesRoute = './uploads/avatar';
        if (fs_1.existsSync(`${filesRoute}/${uuid}.jpg`)) {
            return res.sendFile(image, { root: `${filesRoute}` });
        }
        return res.sendFile('profile.jpg', {
            root: `${__dirname}/../../assets`,
        });
    }
};
__decorate([
    common_1.Get(':uuid'),
    __param(0, common_1.Param('uuid')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AvatarPublicController.prototype, "serveAvatar", null);
AvatarPublicController = __decorate([
    common_1.Controller('avatar'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        images_service_1.ImagesService])
], AvatarPublicController);
exports.AvatarPublicController = AvatarPublicController;
//# sourceMappingURL=avatar.public.controller.js.map