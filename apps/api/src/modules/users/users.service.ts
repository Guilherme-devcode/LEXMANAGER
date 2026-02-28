import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        tenantId: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        totpEnabled: true,
        createdAt: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateUserDto) {
    const exists = await this.prisma.user.findFirst({
      where: { tenantId, email: dto.email },
    });
    if (exists) throw new ConflictException('Email já cadastrado neste escritório');

    const passwordHash = await bcrypt.hash(dto.senha, 12);
    return this.prisma.user.create({
      data: {
        tenantId,
        nome: dto.nome,
        email: dto.email,
        passwordHash,
        role: dto.role,
      },
      select: {
        id: true,
        tenantId: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({ where: { id, tenantId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const data: any = { ...dto };
    if (dto.senha) {
      data.passwordHash = await bcrypt.hash(dto.senha, 12);
      delete data.senha;
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        tenantId: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
    });
  }
}
