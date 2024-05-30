import {
  ethers,
  id,
  concat,
  AbiCoder,
  Interface,
  MessagePrefix,
  encodeBytes32String,
} from "ethers"
import { magicBytesForEIP6492, validateSigOffchainBytecode } from "./constants"

const accountFactoryAddress = process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS // TODO dynamically set?

const accountFactoryABI = ["function createAccount(address owner,bytes32 salt)"]

export const isValidSignature = async (
  signer: ethers.JsonRpcSigner | undefined,
  messageToSign: string,
  signedMessage: string,
  contractWalletAddress: string,
  setDeploymentStatus: (status: string) => void,
  setValidationResult: (result: string) => void,
) => {
  const checkDeploymentStatus = async (): Promise<string> => {
    if (signer) {
      const code = await signer.provider.getCode(contractWalletAddress)
      const status = code !== "0x" ? "Already Deployed" : "Not Deployed Yet"
      setDeploymentStatus(status)
      return status
    }
    return "Not Deployed Yet"
  }

  const deploymentStatus = await checkDeploymentStatus()
  const abiCoder = new AbiCoder()
  let signatureToVerifyWith

  if (deploymentStatus == "Already Deployed") {
    signatureToVerifyWith = signedMessage
  } else {
    const iface = new Interface(accountFactoryABI)
    const salt = encodeBytes32String("salt1")
    const encodedFunctionData = iface.encodeFunctionData(
      "createAccount(address,bytes32)",
      [signer?.address, salt],
    )
    const encodedCall = abiCoder.encode(
      ["address", "bytes", "bytes"],
      [accountFactoryAddress, encodedFunctionData, signedMessage],
    )
    signatureToVerifyWith = concat([encodedCall, magicBytesForEIP6492])
  }

  const messageWithPrefix = MessagePrefix + messageToSign.length + messageToSign
  const validationResult = await signer?.provider.call({
    data: concat([
      validateSigOffchainBytecode,
      abiCoder.encode(
        ["address", "bytes32", "bytes"],
        [contractWalletAddress, id(messageWithPrefix), signatureToVerifyWith],
      ),
    ]),
  })

  if ("0x01" === validationResult) {
    setValidationResult("success!!")
  } else {
    setValidationResult("failed...")
  }
}
