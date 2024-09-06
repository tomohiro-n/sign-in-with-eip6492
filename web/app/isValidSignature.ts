import { JsonRpcSigner } from "ethers"

export const isValidSignature = async (
  signer: JsonRpcSigner | undefined,
  messageToSign: string,
  signedMessage: string,
  contractWalletAddress: string,
  setDeploymentStatus: (status: string) => void,
  setValidationResult: (result: string) => void,
) => {
  const response = await fetch("http://localhost:3001/validate", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      message: messageToSign,
      signature: signedMessage,
      signerAddress: signer?.address,
      walletAddress: contractWalletAddress,
    }),
  })
  const responseJson = await response.json()
  responseJson.isDeployed
    ? setDeploymentStatus("Already Deployed")
    : setDeploymentStatus("Not Deployed Yet")
  responseJson.isValid
    ? setValidationResult("success!!")
    : setValidationResult("failed...")
}
