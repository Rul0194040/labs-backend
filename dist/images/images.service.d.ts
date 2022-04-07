import { FileResultDTO } from '@sanfrancisco/common/DTO/fileResult.dto';
import { ImageEntity } from './model/image.entity';
import { SaveImageDTO } from './model/saveImage.dto';
export declare class ImagesService {
    get(uuid: any): Promise<string | boolean>;
    delete(uuid: string): Promise<ImageEntity>;
    save(file: FileResultDTO, data: SaveImageDTO): Promise<ImageEntity>;
}
