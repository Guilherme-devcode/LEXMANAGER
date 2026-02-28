import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ProcessosModule } from './modules/processos/processos.module';
import { PrazosModule } from './modules/prazos/prazos.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { JobsModule } from './jobs/jobs.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ClientesModule,
    ProcessosModule,
    PrazosModule,
    FinanceiroModule,
    DocumentosModule,
    DashboardModule,
    JobsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    TenantMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register-tenant', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
