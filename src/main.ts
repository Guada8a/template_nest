import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API created with NestJS')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      deepLinking: false,
      persistAuthorization: true
    }
  });

  await app.listen(3000);
}
bootstrap();