import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentosService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll(tenantId: string, processoId?: string) {
    const where: any = { tenantId };
    if (processoId) where.processoId = processoId;

    return this.prisma.documento.findMany({
      where,
      include: {
        uploader: { select: { id: true, nome: true } },
        processo: { select: { id: true, titulo: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upload(
    tenantId: string,
    uploaderId: string,
    file: Express.Multer.File,
    processoId?: string,
  ) {
    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    const tenantDir = path.join(uploadDir, tenantId);
    fs.mkdirSync(tenantDir, { recursive: true });

    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(tenantDir, uniqueName);
    fs.writeFileSync(filePath, file.buffer);

    return this.prisma.documento.create({
      data: {
        tenantId,
        uploaderId,
        processoId,
        nome: uniqueName,
        nomeOriginal: file.originalname,
        mimeType: file.mimetype,
        tamanho: file.size,
        caminho: filePath,
      },
    });
  }

  async download(tenantId: string, id: string) {
    const doc = await this.prisma.documento.findFirst({ where: { id, tenantId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    if (!fs.existsSync(doc.caminho)) throw new NotFoundException('Arquivo não encontrado no servidor');
    return doc;
  }

  async remove(tenantId: string, id: string) {
    const doc = await this.prisma.documento.findFirst({ where: { id, tenantId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    if (fs.existsSync(doc.caminho)) fs.unlinkSync(doc.caminho);
    await this.prisma.documento.delete({ where: { id } });
    return { message: 'Documento excluído com sucesso' };
  }
}
