import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import WalletConnect from './WalletConnect';
import 'src/config/header.css';

import logo from '../src/assets/web3_logo.svg';

const Header = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    watch: true,
  });
  const { chain } = useNetwork();
  
  const [networkStatus, setNetworkStatus] = useState('online');

  useEffect(() => {
    if (chain && chain.id !== 1) {
      setNetworkStatus('wrong-network');
    } else {
      setNetworkStatus('online');
    }
  }, [chain]);

  return (
    <header className="web3-header">
      <div className="header-left">
        <img src={logo} alt="DApp Logo" className="logo" />
        <h1>CryptoWallet</h1>
      </div>
      
      <div className="header-center">
        <nav>
          <ul>
            <li><a href="#" className="active">Wallet</a></li>
            <li><a href="#">Exchange</a></li>
            <li><a href="#">NFTs</a></li>
            <li><a href="#">Staking</a></li>
          </ul>
        </nav>
      </div>
      
      <div className="header-right">
        {isConnected && (
          <div className="network-status">
            <div className={`status-indicator ${networkStatus}`}></div>
            <span>{chain?.name || 'Unknown Network'}</span>
          </div>
        )}
        
        <WalletConnect />
        
        {isConnected && balance && (
          <div className="balance-display">
            <span>{parseFloat(balance.formatted).toFixed(4)}</span>
            <span>{balance.symbol}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;