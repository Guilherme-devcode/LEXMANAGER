import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { UserRole } from '@lexmanager/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registerTenant(dto: RegisterTenantDto) {
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { email: dto.emailTenant },
    });
    if (existingTenant) {
      throw new ConflictException('Já existe um escritório cadastrado com este email');
    }

    const passwordHash = await bcrypt.hash(dto.senha, 12);

    const tenant = await this.prisma.tenant.create({
      data: {
        nome: dto.nomeTenant,
        email: dto.emailTenant,
        cnpj: dto.cnpj,
        users: {
          create: {
            nome: dto.nomeUsuario,
            email: dto.emailUsuario,
            passwordHash,
            role: UserRole.SOCIO,
          },
        },
      },
      include: { users: true },
    });

    const user = tenant.users[0];
    return this.generateTokens(user, tenant.id);
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, ativo: true },
      include: { tenant: { select: { ativo: true } } },
    });

    if (!user || !user.tenant.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.senha, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateTokens(user, user.tenantId, ipAddress, userAgent);
  }

  async refresh(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revogado: false },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new ForbiddenException('Refresh token inválido ou expirado');
    }

    // Rotate token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revogado: true },
    });

    return this.generateTokens(stored.user, stored.user.tenantId);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revogado: false },
      data: { revogado: true },
    });
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tenantId: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        totpEnabled: true,
        createdAt: true,
        tenant: {
          select: { id: true, nome: true, plano: true },
        },
      },
    });
  }

  private async generateTokens(
    user: { id: string; email: string; role: string; tenantId?: string },
    tenantId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const rawRefreshToken = randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
