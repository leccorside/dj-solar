import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getStatus() {
    return this.appService.getStatus();
  }

  @Public()
  @Get('db-check')
  getDbCheck() {
    return this.appService.getDbCheck();
  }
}
