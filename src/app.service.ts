import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource() private dataSource: DataSource
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  getBye(): string {
    return 'Goodbye!';
  }

  async checkDatabaseConnection() {
    try {
      const isConnected = this.dataSource.isInitialized;

      if (isConnected) {
        await this.dataSource.query('SELECT 1');
        return {
          status: 'success',
          message: 'Conexión a la base de datos establecida correctamente',
          isConnected: true,
          database: this.dataSource.options.database,
          version: this.dataSource.driver.version
        };
      }

      return {
        status: 'error',
        message: 'La base de datos no está inicializada',
        isConnected: false
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error al conectar con la base de datos: ${error.message}`,
        isConnected: false
      };
    }
  }

  async checkDatabaseConnectionV2() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'success',
        message: 'Conexión a la base de datos establecida correctamente',
        isConnected: true
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error al conectar con la base de datos: ${error.message}`,
        isConnected: false
      };
    }
  }

  async generateError() {
    // Simulamos un error crítico que romperá el servicio
    setTimeout(() => {
      throw new Error('Error crítico simulado para probar PM2');
    }, 100);

    return {
      message: 'Generando error crítico...'
    };
  }
}
