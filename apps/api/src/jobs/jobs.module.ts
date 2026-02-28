import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrazoAlertProcessor } from './processors/prazo-alert.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'prazo-alerts' }),
  ],
  providers: [PrazoAlertProcessor, MailService],
  exports: [MailService],
})
export class JobsModule {}
