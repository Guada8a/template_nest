import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    private dataSource: DataSource,
  ) { }

  async checkDatabaseConnection() {
    try {
      const dbInfo = await this.dataSource.query(`
        SELECT 
          @@version as version,
          database() as currentDatabase,
          @@hostname as hostname,
          @@port as port
      `);

      return {
        status: 'success',
        message: 'Base de datos conectada correctamente',
        connected: true,
        database: {
          type: 'MySQL',
          version: dbInfo[0].version,
          name: dbInfo[0].currentDatabase,
          host: dbInfo[0].hostname,
          port: dbInfo[0].port,
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error al conectar con la base de datos',
        connected: false,
        error: error.message
      };
    }
  }

  async getTables() {
    const currentDb = await this.dataSource.query('SELECT database() as dbName');
    const dbName = currentDb[0].dbName;

    const tables = await this.dataSource.query(`
        SELECT TABLE_NAME 
        FROM information_schema.tables 
        WHERE TABLE_SCHEMA = ?`,
      [dbName]
    );
    return tables;
  }

  async getTableData(table: string) {
    const currentDb = await this.dataSource.query('SELECT database() as dbName');
    const dbName = currentDb[0].dbName;

    const tableExists = await this.dataSource.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbName, table]
    );

    if (tableExists[0].count === 0) {
      throw new Error(`La tabla '${table}' no existe en la base de datos ${dbName}`);
    }

    const tableData = await this.dataSource.query(`SELECT * FROM \`${dbName}\`.\`${table}\``);
    return tableData;
  }

  async getTableMetadata(table: string) {
    const currentDb = await this.dataSource.query('SELECT database() as dbName');
    const dbName = currentDb[0].dbName;

    const columns = await this.dataSource.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
        FROM information_schema.columns 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION`,
      [dbName, table]
    );

    return columns;
  }
}