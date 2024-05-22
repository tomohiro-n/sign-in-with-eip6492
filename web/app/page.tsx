"use client"
import { MetaMaskProvider } from "@metamask/sdk-react"
import WalletConnectButton from "./components/walletConnectButton";

export default function Home() {

  const host =
  typeof window !== "undefined" ? window.location.host : "defaultHost";
  
  const sdkOptions = {
    dappMetadata: {
      name: "Sign in with EIP-6492",
      url: host,
    },
    infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY
  }


  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed top-0 right-0 p-4">
            <WalletConnectButton/>
          </div>
        </div>
      </main>
    </MetaMaskProvider>
  );
}
