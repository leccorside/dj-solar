import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Prisma } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AUDIT_ENTITY_KEY } from '../decorators/audit-entity.decorator';

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
const NEVER_LOG_FIELDS = new Set(['passwordHash']);

/**
 * Interceptor global de auditoria (item 68 do PROMPT.md). Age apenas em
 * rotas mutantes marcadas com @AuditEntity(...); registra usuário, ação,
 * entidade, ID, IP, data e o diff campo a campo entre o estado anterior e o
 * posterior. Falhas no registro nunca derrubam a requisição original —
 * auditoria é best-effort, não deve quebrar a funcionalidade principal.
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const entity = this.reflector.get<string>(AUDIT_ENTITY_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const method = request.method as string;

    if (!entity || !MUTATING_METHODS.has(method)) {
      return next.handle();
    }

    const entityIdFromParams = request.params?.id as string | undefined;
    const beforePromise = entityIdFromParams
      ? this.fetchEntity(entity, entityIdFromParams)
      : Promise.resolve(null);

    return next.handle().pipe(
      tap((result) => {
        void this.record(entity, method, request, entityIdFromParams, beforePromise, result);
      }),
    );
  }

  private async record(
    entity: string,
    method: string,
    request: { user?: { id: string; email: string }; ip?: string },
    entityIdFromParams: string | undefined,
    beforePromise: Promise<Record<string, unknown> | null>,
    result: unknown,
  ) {
    try {
      const before = await beforePromise;
      const finalEntityId = entityIdFromParams ?? (result as { id?: string })?.id;
      if (!finalEntityId) return;

      // Não assume hard delete: um DELETE pode ser soft delete (registro
      // continua existindo com deletedAt preenchido), então sempre tenta
      // buscar o estado atual — se o registro realmente sumiu, vira null.
      const after = await this.fetchEntity(entity, finalEntityId);

      const action = method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE';
      const changes = this.diff(before, after);

      await this.prisma.auditLog.create({
        data: {
          userId: request.user?.id ?? null,
          userEmail: request.user?.email ?? null,
          action,
          entity,
          entityId: String(finalEntityId),
          ipAddress: request.ip,
          changes: (changes ?? undefined) as Prisma.InputJsonValue | undefined,
        },
      });
    } catch (error) {
      this.logger.warn(`Falha ao registrar auditoria de ${entity}: ${(error as Error).message}`);
    }
  }

  private async fetchEntity(entity: string, id: string): Promise<Record<string, unknown> | null> {
    const modelName = entity.charAt(0).toLowerCase() + entity.slice(1);
    type PrismaDelegate = {
      findUnique: (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
    };
    const delegate = (this.prisma as unknown as Record<string, PrismaDelegate>)[modelName];
    if (!delegate?.findUnique) return null;

    try {
      return await delegate.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }

  private diff(
    before: Record<string, unknown> | null,
    after: Record<string, unknown> | null,
  ): Record<string, { before: unknown; after: unknown }> | null {
    if (!before && !after) return null;
    if (!before) return this.sanitize(after!, (key) => ({ before: null, after: after![key] }));
    if (!after) return this.sanitize(before, (key) => ({ before: before[key], after: null }));

    const changed: Record<string, { before: unknown; after: unknown }> = {};
    for (const key of Object.keys(after)) {
      if (NEVER_LOG_FIELDS.has(key)) continue;
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changed[key] = { before: before[key], after: after[key] };
      }
    }
    return changed;
  }

  private sanitize(
    source: Record<string, unknown>,
    mapper: (key: string) => { before: unknown; after: unknown },
  ) {
    const result: Record<string, { before: unknown; after: unknown }> = {};
    for (const key of Object.keys(source)) {
      if (NEVER_LOG_FIELDS.has(key)) continue;
      result[key] = mapper(key);
    }
    return result;
  }
}
