import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { ImageEntity } from './model/image.entity';
/**
 * Módulo de usuarios
 */

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [],
  providers: [ImagesService],
  exports: [ImagesService, TypeOrmModule.forFeature([ImageEntity])],
})
export class ImagesModule {}
