import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcessoDto, UpdateProcessoDto, AddMovimentacaoDto, AddClienteDto } from './dto/processo.dto';
import { ProcessoStatus, AreaDireito } from '@lexmanager/shared';

@Injectable()
export class ProcessosService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: {
    search?: string;
    status?: ProcessoStatus;
    area?: AreaDireito;
    responsavelId?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, area, responsavelId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (area) where.area = area;
    if (responsavelId) where.responsavelId = responsavelId;
    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { numeroCnj: { contains: search } },
        { comarca: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.processo.findMany({
        where,
        include: {
          responsavel: { select: { id: true, nome: true, email: true } },
          clientes: { include: { cliente: { select: { id: true, nome: true, tipo: true } } } },
          _count: { select: { movimentacoes: true, prazos: true, documentos: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.processo.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(tenantId: string, id: string) {
    const processo = await this.prisma.processo.findFirst({
      where: { id, tenantId },
      include: {
        responsavel: { select: { id: true, nome: true, email: true, role: true } },
        clientes: { include: { cliente: true } },
        movimentacoes: { orderBy: { dataMovimentacao: 'desc' } },
        prazos: {
          where: { status: 'PENDENTE' },
          orderBy: { dataVencimento: 'asc' },
          take: 5,
        },
        documentos: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!processo) throw new NotFoundException('Processo não encontrado');
    return processo;
  }

  async create(tenantId: string, userId: string, dto: CreateProcessoDto) {
    return this.prisma.processo.create({
      data: {
        tenantId,
        responsavelId: dto.responsavelId || userId,
        titulo: dto.titulo,
        area: dto.area,
        numeroCnj: dto.numeroCnj,
        descricao: dto.descricao,
        vara: dto.vara,
        tribunal: dto.tribunal,
        comarca: dto.comarca,
        instancia: dto.instancia,
        valorCausa: dto.valorCausa,
        dataDistribuicao: dto.dataDistribuicao ? new Date(dto.dataDistribuicao) : undefined,
      },
      include: {
        responsavel: { select: { id: true, nome: true, email: true } },
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateProcessoDto) {
    const processo = await this.prisma.processo.findFirst({ where: { id, tenantId } });
    if (!processo) throw new NotFoundException('Processo não encontrado');

    const data: any = { ...dto };
    if (dto.dataDistribuicao) {
      data.dataDistribuicao = new Date(dto.dataDistribuicao);
    }

    return this.prisma.processo.update({ where: { id }, data });
  }

  async remove(tenantId: string, id: string) {
    const processo = await this.prisma.processo.findFirst({ where: { id, tenantId } });
    if (!processo) throw new NotFoundException('Processo não encontrado');
    await this.prisma.processo.delete({ where: { id } });
    return { message: 'Processo excluído com sucesso' };
  }

  async addMovimentacao(tenantId: string, processoId: string, dto: AddMovimentacaoDto) {
    const processo = await this.prisma.processo.findFirst({ where: { id: processoId, tenantId } });
    if (!processo) throw new NotFoundException('Processo não encontrado');

    return this.prisma.movimentacao.create({
      data: {
        processoId,
        titulo: dto.titulo,
        descricao: dto.descricao,
        dataMovimentacao: dto.dataMovimentacao ? new Date(dto.dataMovimentacao) : new Date(),
      },
    });
  }

  async addCliente(tenantId: string, processoId: string, dto: AddClienteDto) {
    const processo = await this.prisma.processo.findFirst({ where: { id: processoId, tenantId } });
    if (!processo) throw new NotFoundException('Processo não encontrado');

    const cliente = await this.prisma.cliente.findFirst({
      where: { id: dto.clienteId, tenantId },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    return this.prisma.processoCliente.upsert({
      where: { processoId_clienteId: { processoId, clienteId: dto.clienteId } },
      update: { papel: dto.papel || 'AUTOR' },
      create: { processoId, clienteId: dto.clienteId, papel: dto.papel || 'AUTOR' },
    });
  }
}
