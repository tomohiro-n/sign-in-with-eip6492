import { Injectable } from "@nestjs/common"
import {
  AbiCoder,
  concat,
  encodeBytes32String,
  ethers,
  id,
  Interface,
  MessagePrefix,
} from "ethers"
import {
  ValidateSignatureInDTO,
  ValidateSignatureOutDTO,
} from "./app.controller"
import { EthereumProvider } from "./ethereum.provider"
import {
  accountFactoryABI,
  magicBytesForEIP6492,
  validateSigOffchainBytecode,
} from "./constants"

@Injectable()
export class AppService {
  accountFactoryAddress = process.env.ACCOUNT_FACTORY_ADDRESS // TODO dynamically set?
  private wallet: ethers.Wallet

  constructor(private readonly ethereumProvider: EthereumProvider) {
    this.wallet = ethereumProvider.wallet
  }

  getHello(): string {
    return "Hello World!"
  }

  async validateSignature(
    input: ValidateSignatureInDTO,
  ): Promise<ValidateSignatureOutDTO> {
    const isDeployed = await this.isWalletDeployed(input.walletAddress)
    const isValid = await this.isSignatureValid(input, isDeployed)
    return {
      isDeployed,
      isValid,
    }
  }

  private async isWalletDeployed(walletAddress: string): Promise<boolean> {
    const code = await this.wallet.provider.getCode(walletAddress)
    return code !== "0x"
  }

  private async isSignatureValid(
    input: ValidateSignatureInDTO,
    isWalletDeployed: boolean,
  ): Promise<boolean> {
    const abiCoder = new AbiCoder()
    let signatureToVerifyWith

    if (isWalletDeployed) {
      signatureToVerifyWith = input.signature
    } else {
      const iface = new Interface(accountFactoryABI)
      const salt = encodeBytes32String("salt1")
      const encodedFunctionData = iface.encodeFunctionData(
        "createAccount(address,bytes32)",
        [input.signerAddress, salt],
      )
      const encodedCall = abiCoder.encode(
        ["address", "bytes", "bytes"],
        [this.accountFactoryAddress, encodedFunctionData, input.signature],
      )
      signatureToVerifyWith = concat([encodedCall, magicBytesForEIP6492])
    }

    const messageWithPrefix =
      MessagePrefix + input.message.length + input.message
    const validationResult = await this.wallet.provider.call({
      data: concat([
        validateSigOffchainBytecode,
        abiCoder.encode(
          ["address", "bytes32", "bytes"],
          [input.walletAddress, id(messageWithPrefix), signatureToVerifyWith],
        ),
      ]),
    })
    return "0x01" === validationResult
  }
}
