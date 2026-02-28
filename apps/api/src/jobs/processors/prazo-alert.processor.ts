import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail.service';

@Processor('prazo-alerts')
export class PrazoAlertProcessor extends WorkerHost {
  private readonly logger = new Logger(PrazoAlertProcessor.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {
    super();
  }

  async process(job: Job) {
    const { prazoId, diasAntes, prazo } = job.data;
    this.logger.log(`Processando alerta de prazo: ${prazoId} (${diasAntes} dias antes)`);

    try {
      await this.mailService.sendPrazoAlert(prazo, diasAntes);

      await this.prisma.prazoNotificacao.updateMany({
        where: { prazoId, diasAntes, status: 'PENDENTE' },
        data: { status: 'ENVIADO', enviadoEm: new Date() },
      });

      this.logger.log(`Alerta enviado para prazo ${prazoId}`);
    } catch (error) {
      this.logger.error(`Falha ao enviar alerta para prazo ${prazoId}:`, error);

      await this.prisma.prazoNotificacao.updateMany({
        where: { prazoId, diasAntes, status: 'PENDENTE' },
        data: { status: 'FALHOU', erro: String(error) },
      });

      throw error;
    }
  }
}
