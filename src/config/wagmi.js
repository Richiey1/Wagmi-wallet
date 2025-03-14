import { http, createConfig } from 'wagmi'
import { base, mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID

export const config = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/VITE_APPKIT_PROJECT_ID'),
    [base.id]: http('https://mainnet.base.org'),
    [sepolia.id]: http('https://sepolia.infura.io/v3/VITE_APPKIT_PROJECT_ID'),
  },
})
