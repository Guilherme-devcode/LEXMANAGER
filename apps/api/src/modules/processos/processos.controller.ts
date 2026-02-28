import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProcessosService } from './processos.service';
import { CreateProcessoDto, UpdateProcessoDto, AddMovimentacaoDto, AddClienteDto } from './dto/processo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProcessoStatus, AreaDireito } from '@lexmanager/shared';

@Controller('processos')
@UseGuards(JwtAuthGuard)
export class ProcessosController {
  constructor(private processosService: ProcessosService) {}

  @Get()
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('status') status?: ProcessoStatus,
    @Query('area') area?: AreaDireito,
    @Query('responsavelId') responsavelId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.processosService.findAll(tenantId, { search, status, area, responsavelId, page, limit });
  }

  @Get(':id')
  findOne(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    return this.processosService.findOne(tenantId, id);
  }

  @Post()
  create(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProcessoDto,
  ) {
    return this.processosService.create(tenantId, userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProcessoDto,
  ) {
    return this.processosService.update(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    return this.processosService.remove(tenantId, id);
  }

  @Post(':id/movimentacoes')
  addMovimentacao(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AddMovimentacaoDto,
  ) {
    return this.processosService.addMovimentacao(tenantId, id, dto);
  }

  @Post(':id/clientes')
  addCliente(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AddClienteDto,
  ) {
    return this.processosService.addCliente(tenantId, id, dto);
  }
}
