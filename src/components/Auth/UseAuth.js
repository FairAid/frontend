import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [signer, setSigner] = useState(null);
  const navigate = useNavigate();

  const isAuth = async () => {
    try {
      if (!window.ethereum) {
        setAuth(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUser(address);
        setSigner(signer);
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuth(false);
    }
  };

  useEffect(() => {
    isAuth(); // Check if the user is already connected on component mount

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask
          setAuth(false);
          setUser(null);
          setSigner(null);
          navigate('/'); // Redirect to base page
        } else {
          // User changed their account
          const newAccount = accounts[0];
          setUser(newAccount);
          setAuth(true);
        }
      });
    }

    // Clean up the event listener on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return {
    auth,
    user,
    signer,
    setSigner,
    setAuth,
    setUser,
  };
};

export default useAuth;
