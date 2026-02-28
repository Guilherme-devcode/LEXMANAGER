import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const next7days = new Date();
    next7days.setDate(next7days.getDate() + 7);

    const [
      processosAtivos,
      prazosProximos,
      receitaMes,
      inadimplenciaTotal,
      processosPorStatus,
      proximosPrazos,
    ] = await Promise.all([
      this.prisma.processo.count({ where: { tenantId, status: 'ATIVO' } }),

      this.prisma.prazo.count({
        where: {
          tenantId,
          status: 'PENDENTE',
          dataVencimento: { lte: next7days, gte: now },
        },
      }),

      this.prisma.lancamento.aggregate({
        where: {
          tenantId,
          tipo: 'RECEITA',
          status: 'PAGO',
          dataPagamento: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { valor: true },
      }),

      this.prisma.lancamento.aggregate({
        where: {
          tenantId,
          tipo: 'RECEITA',
          status: 'PENDENTE',
          dataVencimento: { lt: now },
        },
        _sum: { valor: true },
      }),

      this.prisma.processo.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { status: true },
      }),

      this.prisma.prazo.findMany({
        where: {
          tenantId,
          status: 'PENDENTE',
          dataVencimento: { gte: now },
        },
        include: {
          responsavel: { select: { id: true, nome: true } },
          processo: { select: { id: true, titulo: true, numeroCnj: true } },
        },
        orderBy: { dataVencimento: 'asc' },
        take: 10,
      }),
    ]);

    const processosPorStatusMap = processosPorStatus.reduce(
      (acc, item) => ({ ...acc, [item.status]: item._count.status }),
      {} as Record<string, number>,
    );

    return {
      processosAtivos,
      prazosProximos,
      receitaMensal: receitaMes._sum.valor?.toString() || '0',
      inadimplencia: inadimplenciaTotal._sum.valor?.toString() || '0',
      processosPorStatus: processosPorStatusMap,
      proximosPrazos,
    };
  }
}
