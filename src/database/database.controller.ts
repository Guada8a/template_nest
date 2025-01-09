import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) { }

  @Get('health')
  async checkDatabaseConnection() {
    return await this.databaseService.checkDatabaseConnection();
  }

  @Get('tables')
  async getTables() {
    return await this.databaseService.getTables();
  }

  @Get('tables/:table')
  async getTableData(@Param('table') table: string) {
    return await this.databaseService.getTableData(table);
  }
}
