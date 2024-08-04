import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from './components/AuthProvider';
import "./App.css";

const MetaMask = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const navigate = useNavigate();
    const { setAuth, setUser, user } = useAuthContext();
  
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          accountChanged(accounts[0]);
          navigate('/profile');  // Redirect to profile page upon successful connection
        } catch (error) {
          setErrorMessage('Failed to connect to MetaMask.');
        }
      } else {
        setErrorMessage('Install MetaMask!');
      }
    };
  
    const accountChanged = (accountName) => {
      const formattedAccount = `${accountName.substring(0, 8)}...${accountName.substring(accountName.length - 6)}`;
      setDefaultAccount(formattedAccount);
      setUser(accountName); // Update user state
      setAuth(true); // Set auth to true
    };
  
    // Update the defaultAccount from the context if available
    useEffect(() => {
      if (user) {
        const formattedAccount = `${user.substring(0, 8)}...${user.substring(user.length - 6)}`;
        setDefaultAccount(formattedAccount);
      }
    }, [user]);
  
    return (
      <div>
        {!defaultAccount ? (
          errorMessage ? (
            <h3>{errorMessage}</h3>
          ) : (
            <button onClick={connectWallet}>
              Connect Wallet
            </button>
          )
        ) : (
          <button>
            {defaultAccount}
          </button>
        )}
      </div>
    );
  };
  
  export default MetaMask;