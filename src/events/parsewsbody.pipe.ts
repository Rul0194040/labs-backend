import { PipeTransform, Injectable } from '@nestjs/common';
import { WSMessageBodyDTO } from './messagebody.dto';
/**
 * @ignore
 */
@Injectable()
export class ParseWSBodyPipe implements PipeTransform {
  transform(value: WSMessageBodyDTO): any {
    return value.data;
  }
}
