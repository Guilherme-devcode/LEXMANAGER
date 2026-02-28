import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({ storage: multer.memoryStorage() }),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
})
export class DocumentosModule {}
