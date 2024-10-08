"use client"
import { useState } from "react"
import { ethers } from "ethers"
import { MetaMaskProvider } from "@metamask/sdk-react"
import WalletConnectButton from "./components/walletConnectButton"
import { isValidSignature } from "./isValidSignature"

export default function Home() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(
    undefined,
  )
  const [messageToSign, setMessageToSign] = useState("")
  const [signMethod, setSignMethod] = useState("metamask")
  const [signedMessage, setSignedMessage] = useState("")
  const [contractWalletAddress, setContractWalletAddress] = useState("")
  const [deploymentStatus, setDeploymentStatus] = useState("")
  const [validationResult, setValidationResult] = useState("")

  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost"

  const sdkOptions = {
    dappMetadata: {
      name: "Sign in with EIP-6492",
      url: host,
    },
    infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  }

  const handleMessageToSignChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessageToSign(event.target.value)
  }

  const handleContractWalletAddressChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContractWalletAddress(event.target.value)
  }

  const handleSignMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSignMethod(event.target.value)
  }

  const isSigningEnabled = () => {
    return messageToSign !== "" && signMethod === "metamask"
  }

  const signMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const _signedMessage = await signer?.signMessage(messageToSign)
    setSignedMessage(_signedMessage || "")
  }

  const handleIsValidSignature = async () => {
    await isValidSignature(
      signer,
      messageToSign,
      signedMessage,
      contractWalletAddress,
      setDeploymentStatus,
      setValidationResult,
    )
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
          <div className="mb-8">
            <div className="text-xl font-bold mb-2">
              Step 1: Choose how to sign
            </div>
            <div>
              <div className="ml-5 mb-4">
                <input
                  type="radio"
                  name="sign-method"
                  value="metamask"
                  checked={signMethod === "metamask"}
                  onChange={handleSignMethodChange}
                />{" "}
                ECDSA with MetaMask(sorry the only option for now!)
                <br />
              </div>
              <div>
                If you chose MetaMask, please connect your wallet from right top
                before signing.
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="text-xl font-bold mb-2">Step 2: Sign a message</div>
            <div>
              <textarea
                className="w-full p-2 border rounded"
                id="message-to-sign"
                placeholder="Message to sign"
                value={messageToSign}
                onChange={handleMessageToSignChange}
              ></textarea>
              <button
                disabled={!isSigningEnabled()}
                onClick={signMessage}
                className={`rounded-full px-4 py-2 mt-2 mb-4 ${
                  isSigningEnabled()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Sign Message
              </button>
              <div className="text-balance">
                Signed message: {signedMessage}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="text-xl font-bold mb-2">
              Step 3: Specify to which contract wallet you want to verify the
              signature
            </div>
            <textarea
              className="w-full p-2 border rounded"
              id="contract-wallet-address"
              placeholder="Contract wallet address to verify to"
              value={contractWalletAddress}
              onChange={handleContractWalletAddressChange}
            ></textarea>
          </div>
          <div className="mb-8">
            <div className="text-xl font-bold mb-2">
              Step 4: Verify the signature
            </div>
            <button
              disabled={signedMessage === ""}
              onClick={handleIsValidSignature}
              className="bg-blue-500 text-white rounded-full px-4 py-2"
            >
              Verify Signature
            </button>
          </div>
          <div className="mb-8">
            <div className="text-xl font-bold mb-2">Validation Result</div>
            <div className="text-balance">
              <div className="ml-5">
                Contract Wallet Deployment Status: {deploymentStatus}
              </div>
              <div className="ml-5">Validation Result: {validationResult}</div>
            </div>
          </div>
        </div>
      </main>
    </MetaMaskProvider>
  )
}
