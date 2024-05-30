import { useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { useSDK } from "@metamask/sdk-react"

interface WalletConnectButtonProps {
  setSigner: (signer: ethers.JsonRpcSigner | undefined) => void
}

export default function WalletConnectButton({
  setSigner,
}: WalletConnectButtonProps) {
  const { sdk, connected, connecting, account } = useSDK()

  const disconnect = () => {
    if (sdk) {
      sdk.terminate()
    }
  }

  const setSignerInternal = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const _signer = await provider.getSigner()
    setSigner(_signer)
  }, [setSigner])

  const connect = async () => {
    try {
      disconnect()
      await sdk?.connect()
      setSignerInternal()
    } catch (error) {
      console.error(error)
    }
  }

  const toggleConnect = () => {
    if (connected && account) disconnect()
    else connect()
  }

  const RenderConnected = () => {
    if (connected) {
      return (
        <div>
          <div>account: {account}</div>
        </div>
      )
    }
  }

  useEffect(() => {
    const setExistingSigner = async () => {
      if (connected && account) {
        setSignerInternal()
      }
    }
    setExistingSigner()
  }, [connected, account, setSignerInternal])

  return (
    <div>
      <button
        disabled={connecting}
        onClick={toggleConnect}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
      >
        {connected && account ? "Disconnect" : "Connect Wallet"}
      </button>
      <RenderConnected />
    </div>
  )
}
