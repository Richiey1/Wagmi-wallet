import React, { useState } from "react";
import {
  useAccount,
  useBalance,
  useEnsName,
  useEnsAvatar,
  useChainId,
  useDisconnect,
  useSwitchChain,
  useChains,
} from "wagmi";
import { shortenAddress } from "../utils/addressUtils";
import "./account.css";

export const Account = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { chain } = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const chains = useChains();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("assets");

  const transactions = [
    {
      id: "1",
      type: "send",
      to: "0x1234567890abcdef1234567890abcdef12345678",
      amount: "0.1",
      token: "ETH",
      timestamp: Date.now() - 86400000,
    },
    {
      id: "2",
      type: "receive",
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: "0.25",
      token: "ETH",
      timestamp: Date.now() - 172800000,
    },
  ];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatBalance = (value) => {
    if (!value) return "0.0000";
    return parseFloat(value).toFixed(4);
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSwitchChain = (chainId) => {
    const selectedChain = chains.find((c) => c.id === chainId);
    if (selectedChain) {
      switchChain({ chainId });
    }
  };

  if (!isConnected) {
    return (
      <div className="account-container not-connected">
        <div className="connect-prompt">
          <div className="connect-icon">🔒</div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to view your account details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-identity">
          {ensAvatar ? (
            <img src={ensAvatar} alt="ENS Avatar" className="account-avatar" />
          ) : (
            <div className="account-avatar-placeholder">
              {address && address.substring(2, 4).toUpperCase()}
            </div>
          )}
          <div className="account-details">
            <h2 className="account-name">{ensName || "My Wallet"}</h2>
            <div className="account-address" onClick={copyAddress}>
              <span>{shortenAddress(address)}</span>
              <span>{copied ? "✔" : "📋"}</span>
            </div>
          </div>
        </div>
        <div className="account-balance">
          <div className="balance-info">
            <span className="balance-value">
              {balance ? formatBalance(balance.formatted) : "0.0000"}
            </span>
            <span className="balance-symbol">{balance?.symbol || "ETH"}</span>
          </div>
        </div>
      </div>
      <div className="account-tabs">
        <button
          className={`tab-button ${activeTab === "assets" ? "active" : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          Assets
        </button>
        <button
          className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button
          className={`tab-button ${activeTab === "nfts" ? "active" : ""}`}
          onClick={() => setActiveTab("nfts")}
        >
          NFTs
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "assets" && (
          <div className="assets-tab">
            <div className="token-list">
              <div className="token-item">
                <div className="token-icon-name">
                  <div className="token-icon">ETH</div>
                  <div className="token-name-ticker">
                    <span className="token-name">Ethereum</span>
                    <span className="token-ticker">ETH</span>
                  </div>
                </div>
                <div className="token-balance-value">
                  <span className="token-balance">
                    {balance ? formatBalance(balance.formatted) : "0.0000"}
                  </span>
                  <span className="token-value">
                    $
                    {balance
                      ? (parseFloat(balance.formatted) * 2650).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-tab">
            {transactions.length > 0 ? (
              <div className="transactions-list">
                {transactions.map((tx) => (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-icon">
                      {tx.type === "send" ? "↑" : "↓"}
                    </div>

                    <div className="transaction-details">
                      <div className="transaction-title">
                        {tx.type === "send" ? "Sent" : "Received"}
                      </div>
                      <div className="transaction-subtitle">
                        {tx.type === "send"
                          ? `To: ${shortenAddress(tx.to)}`
                          : `From: ${shortenAddress(tx.from)}`}
                      </div>
                      <div className="transaction-time">
                        {formatTime(tx.timestamp)}
                      </div>
                    </div>

                    <div className="transaction-amount">
                      {tx.type === "send"
                        ? `-${tx.amount} ${tx.token}`
                        : `+${tx.amount} ${tx.token}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-transactions">
                <p>No transactions found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "nfts" && (
          <div className="nfts-tab">
            <div className="no-nfts">
              <p>No NFTs found in this wallet</p>
            </div>
          </div>
        )}
      </div>

      <div className="network-info">
        <span>Connected to: {chain?.name || "Unknown Network"}</span>
        <select onChange={(e) => handleSwitchChain(parseInt(e.target.value))}>
          <option value="1">Ethereum</option>
          <option value="11155111">Sepolia</option>
          <option value="8453">Base</option>
          <option value="84531">Base Goerli</option>
          <option value="137">Polygon</option>
          <option value="80002">Amoy</option>
          <option value="10">Optimism Mainnet</option>
          <option value="420">Optimism Goerli</option>
          <option value="534">Scroll Alpha</option>
          <option value="534354">Scroll Sepolia</option>
        </select>
      </div>
      <button className="disconnect-button" onClick={disconnect}>
        Disconnect
      </button>
    </div>
  );
};

export default Account;
