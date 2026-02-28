import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import * as fs from 'fs';

@Controller('documentos')
@UseGuards(JwtAuthGuard)
export class DocumentosController {
  constructor(private documentosService: DocumentosService) {}

  @Get()
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('processoId') processoId?: string,
  ) {
    return this.documentosService.findAll(tenantId, processoId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: undefined })) // use memory storage
  async upload(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Query('processoId') processoId?: string,
  ) {
    return this.documentosService.upload(tenantId, userId, file, processoId);
  }

  @Get(':id/download')
  async download(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const doc = await this.documentosService.download(tenantId, id);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.nomeOriginal}"`);
    res.setHeader('Content-Type', doc.mimeType);
    const stream = fs.createReadStream(doc.caminho);
    stream.pipe(res);
  }

  @Delete(':id')
  remove(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    return this.documentosService.remove(tenantId, id);
  }
}
