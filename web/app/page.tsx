"use client"
import { useState } from "react"
import { MetaMaskProvider } from "@metamask/sdk-react"
import WalletConnectButton from "./components/walletConnectButton";

export default function Home() {
  const [messageToSign, setMessageToSign] = useState("")

  const host =
  typeof window !== "undefined" ? window.location.host : "defaultHost";
  
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

  const signMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    console.log(messageToSign)
  }

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <main className="flex min-h-screen flex-col items-center justify-start p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed top-0 right-0 p-4">
            <WalletConnectButton/>
          </div>
        </div>
        <div className="flex w-full flex-grow flex-col justify-center gap-4">
          <textarea id="message-to-sign" placeholder="Message to sign" value={messageToSign} onChange={handleTextareaChange}></textarea>
          <button
            disabled={messageToSign === ""}
            onClick={signMessage}
            className="bg-blue-500 text-white rounded-full px-4 py-2">
              Sign Message
          </button>
        </div>
      </main>
    </MetaMaskProvider>
  );
}
