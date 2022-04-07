import { ImagesService } from './../../images/images.service';
import { UsersService } from '../users.service';
import { FileResultDTO } from '@sanfrancisco/common/DTO/fileResult.dto';
import { ImageEntity } from '@sanfrancisco/images/model/image.entity';
export declare class AvatarController {
    private readonly usersService;
    private readonly imagesService;
    constructor(usersService: UsersService, imagesService: ImagesService);
    uploadImage(file: FileResultDTO, req: any): Promise<ImageEntity>;
}
