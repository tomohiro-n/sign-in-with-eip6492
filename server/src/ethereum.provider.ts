import { Injectable } from "@nestjs/common"
import { ethers } from "ethers"

@Injectable()
export class EthereumProvider {
  private _wallet: ethers.Wallet

  constructor() {
    const privateKey =
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" // Popular junk key
    const provider = this.makeProvider()
    this._wallet = new ethers.Wallet(privateKey, provider)
  }

  private makeProvider(): ethers.Provider {
    return new ethers.JsonRpcProvider("http://127.0.0.1:8545")
  }

  get wallet(): ethers.Wallet {
    return this._wallet
  }
}
