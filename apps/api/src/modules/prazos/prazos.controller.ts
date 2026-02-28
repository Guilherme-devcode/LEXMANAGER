import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PrazosService } from './prazos.service';
import { CreatePrazoDto, UpdatePrazoDto } from './dto/prazo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrazoStatus } from '@lexmanager/shared';

@Controller('prazos')
@UseGuards(JwtAuthGuard)
export class PrazosController {
  constructor(private prazosService: PrazosService) {}

  @Get()
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('status') status?: PrazoStatus,
    @Query('responsavelId') responsavelId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.prazosService.findAll(tenantId, { status, responsavelId, page, limit });
  }

  @Post()
  create(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePrazoDto,
  ) {
    return this.prazosService.create(tenantId, userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePrazoDto,
  ) {
    return this.prazosService.update(tenantId, id, dto);
  }
}
