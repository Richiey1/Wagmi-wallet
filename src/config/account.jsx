import { useAccount, useDisconnect, useEnsName, useEnsAvatar, useSwitchChain } from 'wagmi'
import { useState } from 'react'
import './account.css' 

export function Account() {
  const { address, isConnected, connector, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain, chains } = useSwitchChain()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || '' })
  const [selectedChain, setSelectedChain] = useState(chain?.id || '')

  if (!isConnected) return <p className="status-text">Not Connected</p>

  return (
    <div className="account-container">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      <div className="account-info">
        <p><strong>Address:</strong> {ensName ? `${ensName} (${address})` : address}</p>
        <p><strong>Connected with:</strong> {connector?.name}</p>
        <p><strong>Chain:</strong> {chain?.name} (ID: {chain?.id})</p>
      </div>

      <select
        className="chain-selector"
        value={selectedChain}
        onChange={(e) => {
          const chainId = Number(e.target.value)
          setSelectedChain(chainId)
          switchChain({ chainId })
        }}
      >
        {chains.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button className="disconnect-button" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}
