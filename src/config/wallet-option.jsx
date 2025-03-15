import React, { useState } from "react";
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
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

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
      connect({ connector });
      setIsModalOpen(false);
    }
  };

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
        >
          <FaWallet /> Connect Wallet
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
              {connectors.map((connector) => (
                <motion.div
                  key={connector.id}
                  className={`wallet-option ${
                    connector.ready ? "" : "wallet-disabled"
                  }`}
                  whileHover={{ scale: connector.ready ? 1.05 : 1 }}
                  onClick={() => connector.ready && handleConnect(connector)}
                >
                  <img
                    src={connector.icon}
                    alt=""
                    className="wallet-icon"
                    style={{ marginRight: "20px", height: "30px" }}
                  />
                  <span className="wallet-name">{connector.name}</span>
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
