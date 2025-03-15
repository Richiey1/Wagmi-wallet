import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount } from 'wagmi'
import { config } from './config/wagmi'
import Account from './config/account.jsx'; 
import WalletOptions from './config/wallet-option.jsx'; 

const queryClient = new QueryClient()

function ConnectWallet() {
  const { isConnected } = useAccount()
  return isConnected ? <Account /> : <WalletOptions />
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
         <ConnectWallet />
      </QueryClientProvider>
     </WagmiProvider>
  )
}

export default App