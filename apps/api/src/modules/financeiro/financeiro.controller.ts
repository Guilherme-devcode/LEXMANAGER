import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';
import { CreateLancamentoDto, UpdateLancamentoDto } from './dto/lancamento.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LancamentoTipo, LancamentoStatus, UserRole } from '@lexmanager/shared';

@Controller('financeiro')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SOCIO, UserRole.FINANCEIRO)
export class FinanceiroController {
  constructor(private financeiroService: FinanceiroService) {}

  @Get('lancamentos')
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('tipo') tipo?: LancamentoTipo,
    @Query('status') status?: LancamentoStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.financeiroService.findAll(tenantId, { tipo, status, page, limit });
  }

  @Post('lancamentos')
  create(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLancamentoDto,
  ) {
    return this.financeiroService.create(tenantId, userId, dto);
  }

  @Patch('lancamentos/:id')
  update(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLancamentoDto,
  ) {
    return this.financeiroService.update(tenantId, id, dto);
  }

  @Patch('lancamentos/:id/pagar')
  pagar(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    return this.financeiroService.pagar(tenantId, id);
  }
}
