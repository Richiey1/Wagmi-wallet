import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { shortenAddress } from "../utils/addressUtils";
import { motion } from "framer-motion";
import {
  FaCopy,
  FaCheck,
  FaTimes,
  FaWallet,
  FaShieldAlt,
} from "react-icons/fa";
import "../config/wallet-option.css";

const WalletConnect = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [pendingConnectorUID, setPendingConnectorUID] = useState(null);

  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

  const walletConnectConnector = connectors.find(
    (connector) => connector.id === "walletConnect"
  );

  const otherConnectors = connectors.filter(
    (connector) => connector.id !== "walletConnect"
  );

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleConnect = (connector) => {
    if (connector) {
      setPendingConnectorUID(connector.uid);
      connect({ connector });
    }
  };

  useEffect(() => {
    if (isConnected && isModalOpen) {
      setIsModalOpen(false);
      setPendingConnectorUID(null);
    }
  }, [isConnected, isModalOpen]);

  return (
    <div className="wallet-container">
      {isConnected ? (
        <motion.div
          className="connected-wallet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="address-display">
            <FaShieldAlt className="shield-icon" />
            <span>{ensName || shortenAddress(address)}</span>
            <button className="copy-btn" onClick={copyToClipboard}>
              {copiedAddress ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          <button className="disconnect-btn" onClick={disconnect}>
            <FaTimes /> Disconnect
          </button>
        </motion.div>
      ) : (
        <motion.button
          className="connect-btn"
          onClick={toggleModal}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          disabled={isPending}
        >
          <FaWallet /> {isPending ? "Connecting..." : "Connect Wallet"}
        </motion.button>
      )}

      {isModalOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="modal-content"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
          >
            <div className="modal-header">
              <h2>Secure Web3 Wallet</h2>
              <button className="modal-close" onClick={toggleModal}>
                <FaTimes />
              </button>
            </div>

            <div className="wallets-list">
              {walletConnectConnector && (
                <motion.div
                  key={walletConnectConnector.id}
                  className={`wallet-option ${
                    pendingConnectorUID === walletConnectConnector.uid
                      ? "pending"
                      : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleConnect(walletConnectConnector)}
                >
                  <img
                    src={
                      walletConnectConnector.icon ||
                      "https://logosarchive.com/wp-content/uploads/2022/02/WalletConnect-icon.svg"
                    }
                    alt="WalletConnect"
                    className="wallet-icon"
                    style={{ marginRight: "10px", height: "30px" }}
                  />
                  <span className="wallet-name">
                    {pendingConnectorUID === walletConnectConnector.uid
                      ? "Connecting..."
                      : walletConnectConnector.name}
                  </span>
                </motion.div>
              )}

              {otherConnectors.map((connector) => (
                <motion.div
                  key={connector.id}
                  className={`wallet-option ${
                    pendingConnectorUID === connector.uid ? "pending" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleConnect(connector)}
                >
                  <img
                    src={connector.icon || "/default-wallet-icon.png"}
                    alt={connector.name}
                    className="wallet-icon"
                    style={{ marginRight: "10px", height: "35px" }}
                  />
                  <span className="wallet-name">
                    {pendingConnectorUID === connector.uid
                      ? "Connecting..."
                      : connector.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="modal-footer">
              <p>
                Haven't got a wallet?{" "}
                <a
                  href="https://ethereum.org/wallets/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get started
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
      {error && <div className="connect-error">{error.message}</div>}
    </div>
  );
};

export default WalletConnect;
