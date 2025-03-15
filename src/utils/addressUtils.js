/**
 * Utility functions for working with Ethereum addresses
 */

/**
 * Shortens an Ethereum address to a user-friendly format
 * @param {string} address - The full Ethereum address
 * @param {number} prefixLength - Number of characters to keep at the beginning
 * @param {number} suffixLength - Number of characters to keep at the end
 * @returns {string} Shortened address in format 0x1234...5678
 */
export const shortenAddress = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address) return '';
  
  // Ensure the address is valid
  if (!address.startsWith('0x') || address.length !== 42) {
    return address;
  }
  
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);
  
  return `${prefix}...${suffix}`;
};

/**
 * Checks if an Ethereum address is valid
 * @param {string} address - The address to validate
 * @returns {boolean} True if address is valid
 */
export const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  // Basic validation: starts with 0x and has 42 characters total
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Formats an address for display with optional highlighting
 * @param {string} address - The Ethereum address
 * @param {boolean} highlight - Whether to highlight segments of the address
 * @returns {string} Formatted address with highlighting spans
 */
export const formatAddressForDisplay = (address, highlight = false) => {
  if (!address || !isValidAddress(address)) return address;
  
  if (!highlight) return shortenAddress(address);
  
  // For highlighting, we split the address into segments with span tags
  const prefix = address.slice(0, 2); // 0x
  const start = address.slice(2, 6);
  const middle = '...';
  const end = address.slice(-4);
  
  return `${prefix}<span class="address-segment">${start}</span>${middle}<span class="address-segment">${end}</span>`;
};