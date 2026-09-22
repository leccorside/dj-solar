import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuditEntity } from '../common/decorators/audit-entity.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@RequirePermissions('users.manage')
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  listPermissions() {
    return this.rolesService.listPermissions();
  }

  @Get('roles')
  list() {
    return this.rolesService.list();
  }

  @Get('roles/:id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @AuditEntity('Role')
  @Post('roles')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @AuditEntity('Role')
  @Patch('roles/:id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @AuditEntity('Role')
  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Put('roles/:id/permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.rolesService.assignPermissions(id, dto, {
      userId: user.id,
      userEmail: user.email,
      ipAddress: req.ip,
    });
  }
}
