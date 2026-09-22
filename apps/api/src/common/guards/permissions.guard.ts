import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

/**
 * Autorização granular (item 66 do PROMPT.md). Só entra em ação em rotas
 * marcadas com @RequirePermissions(...) — todas as demais passam livres
 * (a autenticação em si já é garantida pelo JwtAuthGuard global).
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId: user.roleId },
      include: { permission: true },
    });
    const grantedKeys = new Set(rolePermissions.map((rp) => rp.permission.key));

    const hasAll = required.every((key) => grantedKeys.has(key));
    if (!hasAll) {
      throw new ForbiddenException('Permissão insuficiente para esta ação.');
    }

    return true;
  }
}
