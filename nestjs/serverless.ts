import { createServer } from '@vendia/serverless-express'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './src/app.module'

let cachedServer

export async function handler(event, context, callback) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    })

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )

    app.setGlobalPrefix('api')

    await app.init()

    const expressApp = app.getHttpAdapter().getInstance()
    cachedServer = createServer({ app: expressApp })
  }

  return cachedServer(event, context, callback)
}
