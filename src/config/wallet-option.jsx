import * as React from 'react'
import { useState } from 'react'
import { useConnect } from 'wagmi'
import './wallet-option.css'

export function WalletOptions() {
  const { connectors, connect } = useConnect()
  const [connector, setConnector] = useState(false);

  const handleConnect = (connector) => {
    connect({connector});
  }

  return (
    <div>
    {!connector ? (<button onClick={ () => setConnector(true)} className='connect-wallet-button'> Connect Wallet</button>) : 
      (<div className="wallet-options">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          className="wallet-button"
          onClick={() => handleConnect(connector)}
        >
          {connector.name}
        </button>
      ))}
    </div>
  )}
  </div>
  );
}
