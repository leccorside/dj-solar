import { SetMetadata } from '@nestjs/common';

export const AUDIT_ENTITY_KEY = 'auditEntity';

/**
 * Marca uma rota mutante (POST/PATCH/PUT/DELETE) para ser registrada pelo
 * AuditLogInterceptor global — item 68 do PROMPT.md. O nome deve
 * corresponder a um model do Prisma (ex.: "User", "Role") para permitir o
 * diff automático de campos antes/depois.
 */
export const AuditEntity = (entity: string) => SetMetadata(AUDIT_ENTITY_KEY, entity);
