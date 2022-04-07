import { Injectable } from '@nestjs/common';
import { MyLogger } from '@sanfrancisco/logger';

@Injectable()
export class TareasService {
  private logger = new MyLogger(TareasService.name);
}
