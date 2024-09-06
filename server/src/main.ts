import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  app.enableCors()
  await app.listen(3001)
}
bootstrap()
