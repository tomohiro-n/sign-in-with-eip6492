import { useSDK } from "@metamask/sdk-react"

export default function WalletConnectButton() {

  const { sdk, connected, connecting, account } = useSDK()

  const disconnect = () => {
    if(sdk) {
      sdk.terminate()
    }
  }

  const connect = async () => {
    try {
      disconnect()
      await sdk?.connect()
    } catch (error) {
      console.error(error)
    }
  }

  const toggleConnect = () => {
    if(connected && account) disconnect()
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

  return (
    <div>
      <button
        disabled={connecting}
        onClick={toggleConnect}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
        { (connected && account) ? "Disconnect" : "Connect Wallet" }
      </button>
      <RenderConnected/>
    </div>
  )
}
