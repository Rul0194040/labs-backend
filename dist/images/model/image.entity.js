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
exports.ImageEntity = void 0;
const users_entity_1 = require("../../users/users.entity");
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
let ImageEntity = class ImageEntity extends commonEntity_abstract_1.CommonEntity {
    constructor(id, uuid, title, description, destination, encoding, fieldname, filename, mimetype, originalname, path, size, active, avatar) {
        super();
        this.id = id;
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.destination = destination;
        this.encoding = encoding;
        this.fieldname = fieldname;
        this.filename = filename;
        this.mimetype = mimetype;
        this.originalname = originalname;
        this.path = path;
        this.size = size;
        this.active = active;
        this.avatar = avatar;
    }
};
__decorate([
    typeorm_1.Column({
        name: 'title',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        name: 'description',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        name: 'fieldname',
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "fieldname", void 0);
__decorate([
    typeorm_1.Column({
        name: 'originalname',
        type: 'varchar',
        length: 150,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "originalname", void 0);
__decorate([
    typeorm_1.Column({
        name: 'encoding',
        type: 'varchar',
        length: 150,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "encoding", void 0);
__decorate([
    typeorm_1.Column({
        name: 'mimetype',
        type: 'varchar',
        length: 150,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "mimetype", void 0);
__decorate([
    typeorm_1.Column({
        name: 'destination',
        type: 'varchar',
        length: 150,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "destination", void 0);
__decorate([
    typeorm_1.Column({
        name: 'filename',
        type: 'varchar',
        length: 150,
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "filename", void 0);
__decorate([
    typeorm_1.Column({
        name: 'path',
        type: 'text',
    }),
    __metadata("design:type", String)
], ImageEntity.prototype, "path", void 0);
__decorate([
    typeorm_1.Column({
        name: 'size',
        type: 'int',
        nullable: false,
    }),
    __metadata("design:type", Number)
], ImageEntity.prototype, "size", void 0);
__decorate([
    typeorm_1.OneToOne(() => users_entity_1.UsersEntity, (avatar) => avatar.image, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", users_entity_1.UsersEntity)
], ImageEntity.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], ImageEntity.prototype, "avatarId", void 0);
ImageEntity = __decorate([
    typeorm_1.Entity('images'),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, String, String, String, String, Number, Boolean, users_entity_1.UsersEntity])
], ImageEntity);
exports.ImageEntity = ImageEntity;
//# sourceMappingURL=image.entity.js.map