import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { EthereumProvider } from "./ethereum.provider"

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [EthereumProvider, AppService],
})
export class AppModule {}
