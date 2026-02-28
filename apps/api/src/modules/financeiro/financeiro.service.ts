import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLancamentoDto, UpdateLancamentoDto } from './dto/lancamento.dto';
import { LancamentoTipo, LancamentoStatus } from '@lexmanager/shared';

@Injectable()
export class FinanceiroService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: {
    tipo?: LancamentoTipo;
    status?: LancamentoStatus;
    page?: number;
    limit?: number;
  }) {
    const { tipo, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.lancamento.findMany({
        where,
        include: {
          processo: { select: { id: true, titulo: true, numeroCnj: true } },
          cliente: { select: { id: true, nome: true } },
          criador: { select: { id: true, nome: true } },
        },
        orderBy: { dataVencimento: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.lancamento.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(tenantId: string, criadorId: string, dto: CreateLancamentoDto) {
    return this.prisma.lancamento.create({
      data: {
        tenantId,
        criadorId,
        tipo: dto.tipo,
        descricao: dto.descricao,
        valor: dto.valor,
        dataVencimento: new Date(dto.dataVencimento),
        processoId: dto.processoId,
        clienteId: dto.clienteId,
        categoria: dto.categoria,
        observacoes: dto.observacoes,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateLancamentoDto) {
    const lancamento = await this.prisma.lancamento.findFirst({ where: { id, tenantId } });
    if (!lancamento) throw new NotFoundException('Lançamento não encontrado');

    const data: any = { ...dto };
    if (dto.dataVencimento) data.dataVencimento = new Date(dto.dataVencimento);

    return this.prisma.lancamento.update({ where: { id }, data });
  }

  async pagar(tenantId: string, id: string) {
    const lancamento = await this.prisma.lancamento.findFirst({ where: { id, tenantId } });
    if (!lancamento) throw new NotFoundException('Lançamento não encontrado');

    return this.prisma.lancamento.update({
      where: { id },
      data: { status: 'PAGO', dataPagamento: new Date() },
    });
  }
}
