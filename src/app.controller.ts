import { Controller, Get, Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  async checkDatabaseConnection() {
    return await this.appService.checkDatabaseConnection();
  }
}
