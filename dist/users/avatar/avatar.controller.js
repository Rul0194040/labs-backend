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
exports.AvatarController = void 0;
const images_service_1 = require("./../../images/images.service");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const multer_1 = require("multer");
const users_service_1 = require("../users.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const fileResult_dto_1 = require("../../common/DTO/fileResult.dto");
const imageTypes_enum_1 = require("../../images/imageTypes.enum");
const saveImage_dto_1 = require("../../images/model/saveImage.dto");
const image_entity_1 = require("../../images/model/image.entity");
let AvatarController = class AvatarController {
    constructor(usersService, imagesService) {
        this.usersService = usersService;
        this.imagesService = imagesService;
    }
    async uploadImage(file, req) {
        const data = {
            parent: req['user'].id,
            type: imageTypes_enum_1.ImageTypes.avatar,
        };
        const imagenSubida = await this.imagesService.save(file, data);
        try {
            const imageFile = imagenSubida.uuid + '.jpg';
            const imagePath = imagenSubida.destination + imageFile;
            await this.usersService.updateUserPicture(data.parent, `${imagePath}`);
        }
        catch (error) {
            console.log(error);
        }
        return imagenSubida;
    }
};
__decorate([
    swagger_1.ApiOperation({
        summary: 'Agregar imagen del usuario.',
    }),
    common_1.Post(),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('avatar', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: async (req, file, cb) => {
            if (!((file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') &&
                (file.originalname.split('.').reverse()[0] === 'jpg' ||
                    file.originalname.split('.').reverse()[0] === 'jpeg'))) {
                return cb(new common_1.HttpException('Tipo de archivo no aceptado, se aceptan solamente "image/jpg".', common_1.HttpStatus.BAD_REQUEST), false);
            }
            return cb(null, true);
        },
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const dirPath = `./uploads/${imageTypes_enum_1.ImageTypes.avatar}/`;
                if (!fs_1.existsSync(dirPath)) {
                    fs_1.mkdirSync(dirPath, { recursive: true });
                }
                cb(null, dirPath);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fileResult_dto_1.FileResultDTO, Object]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "uploadImage", null);
AvatarController = __decorate([
    common_1.Controller('avatar'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        images_service_1.ImagesService])
], AvatarController);
exports.AvatarController = AvatarController;
//# sourceMappingURL=avatar.controller.js.map