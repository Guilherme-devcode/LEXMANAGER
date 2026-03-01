import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrazoDto, UpdatePrazoDto } from './dto/prazo.dto';
import { PrazoStatus } from '@lexmanager/shared';

@Injectable()
export class PrazosService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: {
    status?: PrazoStatus;
    responsavelId?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, responsavelId } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (responsavelId) where.responsavelId = responsavelId;

    const [data, total] = await Promise.all([
      this.prisma.prazo.findMany({
        where,
        include: {
          responsavel: { select: { id: true, nome: true, email: true } },
          processo: { select: { id: true, titulo: true, numeroCnj: true } },
        },
        orderBy: { dataVencimento: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.prazo.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(tenantId: string, userId: string, dto: CreatePrazoDto) {
    const prazo = await this.prisma.prazo.create({
      data: {
        tenantId,
        responsavelId: dto.responsavelId || userId,
        processoId: dto.processoId,
        titulo: dto.titulo,
        tipo: dto.tipo,
        descricao: dto.descricao,
        dataVencimento: new Date(dto.dataVencimento),
        alertas: dto.alertas || [1, 3, 7, 15],
      },
    });

    // Create notification records for each alert day
    const alertas = dto.alertas || [1, 3, 7, 15];
    await this.prisma.prazoNotificacao.createMany({
      data: alertas.map((diasAntes) => ({
        prazoId: prazo.id,
        diasAntes,
        canal: 'email',
      })),
      skipDuplicates: true,
    });

    return prazo;
  }

  async findOne(tenantId: string, id: string) {
    const prazo = await this.prisma.prazo.findFirst({
      where: { id, tenantId },
      include: {
        responsavel: { select: { id: true, nome: true, email: true } },
        processo: { select: { id: true, titulo: true, numeroCnj: true } },
      },
    });
    if (!prazo) throw new NotFoundException('Prazo não encontrado');
    return prazo;
  }

  async update(tenantId: string, id: string, dto: UpdatePrazoDto) {
    const prazo = await this.prisma.prazo.findFirst({ where: { id, tenantId } });
    if (!prazo) throw new NotFoundException('Prazo não encontrado');

    const data: any = { ...dto };
    if (dto.dataVencimento) data.dataVencimento = new Date(dto.dataVencimento);
    if (dto.dataConclusao) data.dataConclusao = new Date(dto.dataConclusao);

    const updated = await this.prisma.prazo.update({ where: { id }, data });

    // Sync notification records when alertas change
    if (dto.alertas) {
      await this.prisma.prazoNotificacao.deleteMany({
        where: { prazoId: id, status: 'PENDENTE' },
      });
      await this.prisma.prazoNotificacao.createMany({
        data: dto.alertas.map((diasAntes) => ({
          prazoId: id,
          diasAntes,
          canal: 'email',
        })),
        skipDuplicates: true,
      });
    }

    return updated;
  }

  async remove(tenantId: string, id: string) {
    const prazo = await this.prisma.prazo.findFirst({ where: { id, tenantId } });
    if (!prazo) throw new NotFoundException('Prazo não encontrado');
    await this.prisma.prazo.delete({ where: { id } });
    return { message: 'Prazo excluído com sucesso' };
  }

  async findPrazosDue(daysAhead: number) {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    const startOfDay = new Date(target.setHours(0, 0, 0, 0));
    const endOfDay = new Date(target.setHours(23, 59, 59, 999));

    return this.prisma.prazo.findMany({
      where: {
        status: 'PENDENTE',
        dataVencimento: { gte: startOfDay, lte: endOfDay },
        notificacoes: {
          some: {
            diasAntes: daysAhead,
            status: 'PENDENTE',
          },
        },
      },
      include: {
        responsavel: { select: { id: true, nome: true, email: true } },
        processo: { select: { id: true, titulo: true, numeroCnj: true } },
        notificacoes: { where: { diasAntes: daysAhead, status: 'PENDENTE' } },
      },
    });
  }
}
