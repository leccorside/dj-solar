import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getStatus() {
    return {
      service: 'dj-solar-api',
      status: 'ok',
      step: 'Passo 3 — Prisma + schema inicial + seed',
    };
  }

  async getDbCheck() {
    const [roles, permissions, users] = await Promise.all([
      this.prisma.role.count(),
      this.prisma.permission.count(),
      this.prisma.user.count(),
    ]);

    return { database: 'connected', roles, permissions, users };
  }
}
