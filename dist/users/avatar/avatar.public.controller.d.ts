import { ImagesService } from './../../images/images.service';
import { UsersService } from '../users.service';
export declare class AvatarPublicController {
    private readonly usersService;
    private readonly imagesService;
    constructor(usersService: UsersService, imagesService: ImagesService);
    serveAvatar(uuid: string, res: any): void;
}
