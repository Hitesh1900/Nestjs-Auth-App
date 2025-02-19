import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
    session({
      secret: '123', 
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
