import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

const PROTECTED_ROLE = 'SUPER_ADMIN';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const roles = await this.prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });

    return roles.map((role) => this.toPublicRole(role));
  }

  async findOne(id: string) {
    const role = await this.getRoleOrThrow(id);
    return this.toPublicRole(role);
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Já existe um papel com este nome.');
    }

    const role = await this.prisma.role.create({
      data: { name: dto.name, description: dto.description },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });

    return this.toPublicRole(role);
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.getRoleOrThrow(id);

    const role = await this.prisma.role.update({
      where: { id },
      data: { description: dto.description },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });

    return this.toPublicRole(role);
  }

  async remove(id: string) {
    const role = await this.getRoleOrThrow(id);

    if (role.name === PROTECTED_ROLE) {
      throw new ForbiddenException('O papel SUPER_ADMIN não pode ser excluído.');
    }

    const usersCount = await this.prisma.user.count({ where: { roleId: id, deletedAt: null } });
    if (usersCount > 0) {
      throw new BadRequestException(
        `Este papel está atribuído a ${usersCount} usuário(s) e não pode ser excluído.`,
      );
    }

    await this.prisma.role.delete({ where: { id } });
  }

  async assignPermissions(
    id: string,
    dto: AssignPermissionsDto,
    actor: { userId: string; userEmail: string; ipAddress?: string },
  ) {
    const role = await this.getRoleOrThrow(id);

    if (role.name === PROTECTED_ROLE) {
      throw new ForbiddenException('As permissões do SUPER_ADMIN não podem ser alteradas.');
    }

    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: dto.permissionKeys } },
    });
    const foundKeys = new Set(permissions.map((p) => p.key));
    const missing = dto.permissionKeys.filter((key) => !foundKeys.has(key));
    if (missing.length > 0) {
      throw new BadRequestException(`Permissões inexistentes: ${missing.join(', ')}`);
    }

    const beforeKeys = role.permissions.map((rp) => rp.permission.key).sort();
    const afterKeys = [...foundKeys].sort();

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId: id } }),
      this.prisma.rolePermission.createMany({
        data: permissions.map((permission) => ({ roleId: id, permissionId: permission.id })),
      }),
    ]);

    // Auditoria explícita (item 68): o diff genérico do interceptor global
    // não enxerga a relação Role -> RolePermission, então a mudança real
    // (quais permissões entraram/saíram) é registrada aqui, no service.
    await this.prisma.auditLog.create({
      data: {
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'UPDATE',
        entity: 'RolePermission',
        entityId: id,
        ipAddress: actor.ipAddress,
        changes: { permissionKeys: { before: beforeKeys, after: afterKeys } },
      },
    });

    return this.findOne(id);
  }

  async listPermissions() {
    return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
  }

  private async getRoleOrThrow(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });
    if (!role) {
      throw new NotFoundException('Papel não encontrado.');
    }
    return role;
  }

  private toPublicRole(role: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    permissions: { permission: { key: string } }[];
    _count: { users: number };
  }) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      usersCount: role._count.users,
      permissionKeys: role.permissions.map((rp) => rp.permission.key),
    };
  }
}
