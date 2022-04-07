import { PipeTransform } from '@nestjs/common';
import { WSMessageBodyDTO } from './messagebody.dto';
export declare class ParseWSBodyPipe implements PipeTransform {
    transform(value: WSMessageBodyDTO): any;
}
