import React, { useState, useEffect } from 'react';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../App.css';
import '../../styles/UserPage.css'; 
import { ethers } from 'ethers';

const ec = new EC.ec('p256');

const UserPage = ({signer, user}) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [decryptedData, setDecryptedData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [isIDOpen, setIsIDOpen] = useState(false);

  const contractAddress = "0xd94464119aDe5Ce776E1B426319b5ce865E9E00e";

  const generateKeyPairFromSeed = (seed) => {
    const hash = createHash('sha256').update(seed).digest('hex');
    const keyPair = ec.keyFromPrivate(hash);
    return keyPair;
  };

  const decryptData = (data, privateKey) => {
    try {
      const decryptValue = (value) => {
        const sharedKey = privateKey.derive(keyPair.getPublic()).toString(16);
        const decrypted = CryptoJS.AES.decrypt(value, sharedKey).toString(CryptoJS.enc.Utf8);
        return decrypted;
      };

      const decryptedData = {};
      for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
          decryptedData[key] = decryptData(data[key], privateKey);
        } else {
          decryptedData[key] = decryptValue(data[key]);
        }
      }
      return decryptedData;
    } catch (error) {
      console.error('Error decrypting data:', error);
      setDecryptError('Cannot decrypt data using this key. Please enter the correct seed phrase.');
      setTimeout(() => {
        setDecryptError('');
      }, 7000);
      return null;
    }
  };

  const handleSeedPhraseSubmit = () => {
    if (!seedPhrase) return;
    const keypair = generateKeyPairFromSeed(seedPhrase);
    setKeyPair(keypair);
    setShowModal(false);
  };

  useEffect(() => {
    if (keyPair) {
      handleDecrypt();
    }
  }, [keyPair]);

  const handleDecrypt = async () => {
    if (!keyPair) {
      setShowModal(true);
      return;
    }

    if (isIDOpen) {
      setDecryptedData(null);
      setIsIDOpen(false);
      return;
    }

    try {
      const uri = await fetchDID();
      if (!uri) {
        setFetchError("Error occured when fetching an NFT. Are you sure you've already issued an ID?");
        setTimeout(() => {
          setFetchError('');
        }, 7000);
        return;
      }

      const jsonData = await fetchJsonFromIPFS(uri);
      if (!jsonData) {
        setFetchError('Error fetching JSON from IPFS. Please try again later.');
        setTimeout(() => {
          setFetchError('');
        }, 7000); 
        return;
      }

      const decrypted = decryptData(jsonData, keyPair);
      if (decrypted) {
        setDecryptedData(decrypted);
        setDecryptError('');
        setIsIDOpen(true);
      }
    } catch (error) {
      console.error('Error during decryption process:', error);
      setDecryptError('An error occurred during the decryption process. Please try again.');
      setTimeout(() => {
        setDecryptError('');
      }, 7000);
    }
  };

  const fetchJsonFromIPFS = async (uri) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error fetching JSON from IPFS:', error);
      return null;
    }
  };

  const fetchDID = async() => {
    if (!signer) {
      alert('Please connect to MetaMask to deploy the contract!');
      return;
    }

    try {
      const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmcEUv17JcLE9SxRbSyhmByx5C7oHh7Z1zAT1rQXZkuuq5";
      const artifact = await fetch(artifactUrl).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });
      const { abi } = artifact;
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const token = await contract.findDID(user);
      const uri = await contract.tokenURI(token);
      return uri;
    } catch (error) {
      console.error('Fetching TokenID failed:', error);
      return null;
    }
  };

  return (
    <div style={{padding: "40px"}}>
      <h1>View your refugee ID</h1>
      <button onClick={handleDecrypt}>{isIDOpen ? 'Close ID' : 'Open ID'}</button>

      {(fetchError || decryptError) && (
        <div className="error-popup">
          {fetchError && <p>{fetchError}</p>}
          {decryptError && <p>{decryptError}</p>}
        </div>
      )}

      {decryptedData && isIDOpen && (
        <div className="id-card">
          <h2>ID Card</h2>
          <div className="id-card-content">
            <p><strong>Name:</strong> {decryptedData.attributes.Name}</p>
            <p><strong>Place of birth:</strong> {decryptedData.attributes["Place of birth"]}</p>
            <p><strong>Issued country:</strong> {decryptedData.attributes["Issued country"]}</p>
            <p><strong>Issued authority:</strong> {decryptedData.attributes["Issued authority"]}</p>
            <p><strong>Date of birth:</strong> {decryptedData.attributes["Date of birth"]}</p>
            <p><strong>Passport number:</strong> {decryptedData.attributes["Passport number"]}</p>
            <p><strong>Sex:</strong> {decryptedData.attributes.Sex}</p>
            <p><strong>Registration address:</strong> {decryptedData.attributes["Registration address"]}</p>
            <p><strong>Date of issue:</strong> {decryptedData.attributes["Date of issue"]}</p>
            <p><strong>Date of expiry:</strong> {decryptedData.attributes["Date of expiry"]}</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter password</h2>
            <input 
              type="text" 
              value={seedPhrase} 
              onChange={(e) => setSeedPhrase(e.target.value)} 
            />
            <button className='submit-button' onClick={handleSeedPhraseSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
