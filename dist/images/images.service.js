"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesService = void 0;
const users_entity_1 = require("./../users/users.entity");
const common_1 = require("@nestjs/common");
const fileResult_dto_1 = require("../common/DTO/fileResult.dto");
const fs = require("fs");
const sharp = require("sharp");
const typeorm_1 = require("typeorm");
const imageTypes_enum_1 = require("./imageTypes.enum");
const image_entity_1 = require("./model/image.entity");
let ImagesService = class ImagesService {
    async get(uuid) {
        const image = await typeorm_1.getRepository(image_entity_1.ImageEntity).findOne({
            where: { uuid: uuid },
        });
        const imageRoute = image.destination + image.uuid + '.jpg';
        if (fs.existsSync(imageRoute)) {
            return imageRoute || false;
        }
    }
    async delete(uuid) {
        const imageToDelete = await typeorm_1.getRepository(image_entity_1.ImageEntity).findOne({
            where: { uuid },
        });
        if (!imageToDelete) {
            throw new common_1.HttpException('No existe esa imagen', common_1.HttpStatus.NOT_FOUND);
        }
        const deleteResult = typeorm_1.getRepository(image_entity_1.ImageEntity).delete({ uuid: uuid });
        if ((await deleteResult).affected === 1) {
            const file = `${__dirname}/../../../${imageToDelete.path}`;
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        }
        return imageToDelete;
    }
    async save(file, data) {
        let usuario;
        let minWidth = 800;
        let minHeight = 800;
        switch (data.type) {
            case imageTypes_enum_1.ImageTypes.avatar:
                usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(data.parent);
                minWidth = 800;
                minHeight = 800;
                break;
            default:
                break;
        }
        const image = await sharp(file.path).metadata();
        if (image.width < minWidth || image.height < minHeight) {
            fs.unlinkSync(file.path);
            throw new common_1.HttpException(`La imagen no cumple los requerimientos de tamaño, (${minWidth}x${minHeight})`, common_1.HttpStatus.BAD_REQUEST);
        }
        const imagenExiste = await typeorm_1.getRepository(image_entity_1.ImageEntity).findOne({
            where: { avatarId: usuario.id },
        });
        if (!imagenExiste) {
            const newImage = new image_entity_1.ImageEntity(undefined, undefined, data.title, data.description, file.destination, file.encoding, file.fieldname, file.filename, file.mimetype, file.originalname, file.path, file.size, true, usuario);
            const createdImage = await typeorm_1.getRepository(image_entity_1.ImageEntity).save(newImage);
            const finalFilename = usuario.uuid + '.jpg';
            await sharp(file.path)
                .resize({
                width: minWidth,
                height: minHeight,
                fit: sharp.fit.cover,
                position: 'centre',
            })
                .toFile(file.destination + finalFilename);
            fs.unlinkSync(file.path);
            return createdImage;
        }
        else {
            const finalFilename = usuario.uuid + '.jpg';
            await sharp(file.path)
                .resize({
                width: minWidth,
                height: minHeight,
                fit: sharp.fit.cover,
                position: 'centre',
            })
                .toFile(file.destination + finalFilename);
            fs.unlinkSync(file.path);
            return imagenExiste;
        }
    }
};
ImagesService = __decorate([
    common_1.Injectable()
], ImagesService);
exports.ImagesService = ImagesService;
//# sourceMappingURL=images.service.js.map