import { serverPort } from '../config.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressListRoutes from 'express-list-routes';
import * as helmet from 'helmet';

const port = process.env.SERVER_PORT || serverPort;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({ exposedHeaders: 'X-Has-More-Players' });
  app.use(helmet());

  await app.listen(port);

  const server = app.getHttpServer();
  const router = server._events.request._router;

  console.log(expressListRoutes({}, 'APIs:', router));
  console.log(`The server is running on port ${port}`);
}
bootstrap();
