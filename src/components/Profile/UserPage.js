import React, { useState, useEffect } from 'react';
import useAuth from '../Auth/UseAuth';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../App.css';
import '../../styles/UserPage.css'; 
import { ethers } from 'ethers';

const ec = new EC.ec('p256');

const UserPage = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [decryptedData, setDecryptedData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [idJson, setIdJson] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const { signer } = useAuth();

  // Later it should be set automatically after deployment using Deploy.js
  const contractAddress = "0xA2E34B9a903FF2D9B72893b949ee6523fc679b55"

  useEffect(() => {
    const fetchJsonFromIPFS = async () => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/QmXna3acK52D71hwdisHo6Zb24VPCg4QNkmVPz44N6NeCU');
        const jsonData = await response.json();
        setIdJson(jsonData);
      } catch (error) {
        console.error('Error fetching JSON from IPFS:', error);
      }
    };

    fetchJsonFromIPFS();
  }, []);

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
      }, 15000); // Clear the decryptError after 15 seconds
      return null;
    }
  };

  const handleGenerateKeyPair = () => {
    setShowModal(true);
  };

  const handleSeedPhraseSubmit = () => {
    if (!seedPhrase) return;
    const keypair = generateKeyPairFromSeed(seedPhrase);
    setKeyPair(keypair);

    setShowModal(false);
  };

  const handleDecrypt = () => {
    if (!keyPair) return;

    if (!idJson) {
      setFetchError('Error fetching JSON from IPFS. Please try again later.');
      setTimeout(() => {
        setFetchError('');
      }, 15000); // Clear the fetchError after 15 seconds
      return;
    }

    const decrypted = decryptData(idJson, keyPair);
    if (decrypted) {
      setDecryptedData(decrypted);
      setDecryptError(''); // Clear any previous decrypt error
    }
  };

  return (
    <div>
      <h1>Manage FairAid ID</h1>
      <button onClick={handleGenerateKeyPair}>Generate Key Pair</button>
      <button onClick={handleDecrypt} disabled={!keyPair}>Open ID</button>

      {(fetchError || decryptError) && (
        <div className="error-popup">
          {fetchError && <p>{fetchError}</p>}
          {decryptError && <p>{decryptError}</p>}
        </div>
      )}

      {decryptedData && (
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
            <h2>Enter Seed Phrase</h2>
            <input 
              type="text" 
              value={seedPhrase} 
              onChange={(e) => setSeedPhrase(e.target.value)} 
            />
            <button onClick={handleSeedPhraseSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
