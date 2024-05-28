"use client"
import { useState } from "react"
import { ethers, id, concat, AbiCoder, MessagePrefix } from "ethers"
import { MetaMaskProvider } from "@metamask/sdk-react"
import WalletConnectButton from "./components/walletConnectButton";
import { validateSigOffchainBytecode } from "./constants";

export default function Home() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined)
  const [messageToSign, setMessageToSign] = useState("")
  const [signedMessage, setSignedMessage] = useState("")
  const [deploymentStatus, setDeploymentStatus] = useState("")
  const [validationResult, setValidationResult] = useState("")

  const host =
  typeof window !== "undefined" ? window.location.host : "defaultHost";

  const contractWalletAddress = '0x55bD297bc3922F4278F1B608575d4c405dcEd31e' // TODO dynamically get
  
  const sdkOptions = {
    dappMetadata: {
      name: "Sign in with EIP-6492",
      url: host,
    },
    infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageToSign(event.target.value);
  };

  const signMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const _signedMessage = await signer?.signMessage(messageToSign)
    setSignedMessage(_signedMessage || "");
  }

  const checkDeploymentStatus = async () => {
    if (signer) {
      const code = await signer.provider.getCode(contractWalletAddress);
      setDeploymentStatus(code !== '0x' ? 'Already Deployed' : 'Not Deployed Yet');
    }
  }

  const isValidSignature = async () => {
    checkDeploymentStatus()
    const messageWithPrefix = MessagePrefix + messageToSign.length + messageToSign
    const validationResult = await signer?.provider.call({
      data: concat([
        validateSigOffchainBytecode,
        (new AbiCoder()).encode(['address', 'bytes32', 'bytes'],
          [
            contractWalletAddress,
            id(messageWithPrefix),
            signedMessage
          ])
      ])
    })
    console.log(validationResult)
    if('0x01' === validationResult) {
      setValidationResult("success!!")
    } else {
      setValidationResult("failed...")
    }
  }

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <main className="flex min-h-screen flex-col items-center justify-start p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed top-0 right-0 p-4">
            <WalletConnectButton setSigner={setSigner} />
          </div>
        </div>
        <div className="flex w-full flex-grow flex-col justify-center gap-4">
          <textarea id="message-to-sign" placeholder="Message to sign" value={messageToSign} onChange={handleTextareaChange}></textarea>
          <div className="text-balance">Signed message: {signedMessage}</div>
          <button
            disabled={messageToSign === ""}
            onClick={signMessage}
            className="bg-blue-500 text-white rounded-full px-4 py-2">
              Sign Message
          </button>
          <button
            disabled={signedMessage === ""}
            onClick={isValidSignature}
            className="bg-blue-500 text-white rounded-full px-4 py-2">
              Verify Signature
          </button>
          <div className="text-balance">
            Verification Result:
            <div className="ml-5">Contract Wallet Deployment Status: {deploymentStatus}</div>
            <div className="ml-5">Validation Result: {validationResult}</div>
          </div>
        </div>
      </main>
    </MetaMaskProvider>
  );
}
