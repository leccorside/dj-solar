import { Controller, Get, Query } from '@nestjs/common';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

@RequirePermissions('users.manage')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  list(@Query() query: AuditLogQueryDto) {
    return this.auditLogsService.list(query);
  }
}
