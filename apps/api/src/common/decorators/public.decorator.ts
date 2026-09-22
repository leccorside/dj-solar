import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca uma rota como pública, isentando-a do JwtAuthGuard global.
 * Todas as rotas são protegidas por padrão (item 64 do PROMPT.md) —
 * este decorator é a exceção explícita.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
