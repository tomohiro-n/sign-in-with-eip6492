import { Body, Controller, Get, Put } from "@nestjs/common"
import { AppService } from "./app.service"

export type ValidateSignatureInDTO = {
  walletAddress: string
  signerAddress: string
  signature: string
  message: string
}

export type ValidateSignatureOutDTO = {
  isDeployed: boolean
  isValid: boolean
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Put("/validate")
  async validate(
    @Body() dto: ValidateSignatureInDTO,
  ): Promise<ValidateSignatureOutDTO> {
    return await this.appService.validateSignature(dto)
  }
}
