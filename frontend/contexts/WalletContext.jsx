"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const MetaMaskContext = createContext();

export function useMetaMask() {
  return useContext(MetaMaskContext);
}

export function MetaMaskProvider({ children }) {
  const [account, setAccount] = useState(null);

  const checkWalletConnection = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);

      } else {
        console.warn("MetaMask is not connected.");
        setAccount(null);
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error);
      setAccount(null);
    }
  };

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);

    } else {
        console.warn("User denied MetaMask account access.");
        setAccount(null);
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setAccount(null);
    }
  };

  const disconnectMetaMask = async () => {
    try {
      setAccount(null);
    } catch (error) {
      console.error("MetaMask disconnection error:", error);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const value = {
    account,
    connectMetaMask,
    disconnectMetaMask,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}
