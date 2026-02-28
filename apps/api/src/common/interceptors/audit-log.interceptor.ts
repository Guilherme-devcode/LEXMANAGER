import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;
    const tenantId = request.tenantId || user?.tenantId;

    const isWrite = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
    if (!isWrite || !tenantId) return next.handle();

    const acao = `${method} ${url}`;

    return next.handle().pipe(
      tap({
        next: () => {
          // Write async, don't block response
          setImmediate(() => {
            this.prisma.auditLog
              .create({
                data: {
                  tenantId,
                  userId: user?.id || null,
                  acao,
                  entidade: this.extractEntity(url),
                  ipAddress: ip,
                  dadosDepois: body,
                },
              })
              .catch(() => {
                // Swallow audit log errors
              });
          });
        },
      }),
    );
  }

  private extractEntity(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[0] || 'unknown';
  }
}
