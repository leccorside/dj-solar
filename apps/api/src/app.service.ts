import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'dj-solar-api',
      status: 'ok',
      step: 'Passo 1 — fundação do monorepo',
    };
  }
}
