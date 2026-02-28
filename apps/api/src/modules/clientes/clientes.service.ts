import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { cpfCnpj: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.cliente.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.cliente.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(tenantId: string, id: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, tenantId },
      include: {
        processos: {
          include: { processo: { select: { id: true, titulo: true, numeroCnj: true, status: true } } },
        },
      },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async create(tenantId: string, dto: CreateClienteDto) {
    const { endereco, ...rest } = dto;
    return this.prisma.cliente.create({
      data: {
        ...rest,
        tenantId,
        ...(endereco ? { endereco: endereco as any } : {}),
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateClienteDto) {
    const cliente = await this.prisma.cliente.findFirst({ where: { id, tenantId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    const { endereco, ...rest } = dto;
    return this.prisma.cliente.update({
      where: { id },
      data: {
        ...rest,
        ...(endereco !== undefined ? { endereco: endereco as any } : {}),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const cliente = await this.prisma.cliente.findFirst({ where: { id, tenantId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    await this.prisma.cliente.delete({ where: { id } });
    return { message: 'Cliente excluído com sucesso' };
  }
}
