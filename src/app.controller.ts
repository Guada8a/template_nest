import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Version('1')
  @Get()
  async checkDatabaseConnection() {
    return await this.appService.generateError();
  }

  @Version('2')
  @Get()
  async checkDatabaseConnectionV2() {
    return await this.appService.generateError();
  }

  @Version('3')
  @Get()
  async checkDatabaseConnectionV3() {
    return await this.appService.generateError();
  }
}
