import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Exige que o usuário autenticado tenha todas as permissões informadas
 * (via RolePermission) para acessar a rota — item 66 do PROMPT.md.
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
