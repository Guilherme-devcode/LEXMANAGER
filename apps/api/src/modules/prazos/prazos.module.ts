import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrazosService } from './prazos.service';
import { PrazosController } from './prazos.controller';
import { PrazosScheduler } from './prazos.scheduler';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'prazo-alerts' }),
  ],
  controllers: [PrazosController],
  providers: [PrazosService, PrazosScheduler],
  exports: [PrazosService],
})
export class PrazosModule {}
