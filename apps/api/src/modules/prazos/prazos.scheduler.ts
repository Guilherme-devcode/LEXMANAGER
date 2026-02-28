import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrazosService } from './prazos.service';

@Injectable()
export class PrazosScheduler {
  private readonly logger = new Logger(PrazosScheduler.name);

  constructor(
    @InjectQueue('prazo-alerts') private prazoAlertsQueue: Queue,
    private prazosService: PrazosService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkPrazos() {
    this.logger.log('Verificando prazos próximos...');

    const alertDays = [1, 3, 7, 15];
    for (const days of alertDays) {
      const prazos = await this.prazosService.findPrazosDue(days);
      for (const prazo of prazos) {
        await this.prazoAlertsQueue.add(
          'send-alert',
          { prazoId: prazo.id, diasAntes: days, prazo },
          { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
        );
      }
    }

    this.logger.log('Verificação de prazos concluída');
  }
}
