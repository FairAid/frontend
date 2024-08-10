import React, { useState, useEffect } from 'react';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../App.css';
import '../../styles/UserPage.css';
import { ethers } from 'ethers';

const ec = new EC.ec('p256');

const Mint = ({signer}) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [encryptedData, setEncryptedData] = useState({});
  const [keyPair, setKeyPair] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [idJson, setIdJson] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const user = "0xfd1F5B5F618313E19fA0eA3eEFAb422337AF4f99";
  const contractAddress = "0xA2E34B9a903FF2D9B72893b949ee6523fc679b55"

  useEffect(() => {
    const fetchJsonFromIPFS = async () => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/QmaVBStSnqitf2jPQ2BcBYje7dpX4t4dbSZ6dsE7VQZrAU');
        const jsonData = await response.json();
        setIdJson(jsonData);
      } catch (error) {
        console.error('Error fetching JSON from IPFS:', error);
      }
    };

    fetchJsonFromIPFS();
  }, []);

  const mintDID = async() => {
    if (!signer) {
      alert('Please connect to MetaMask to deploy the contract!');
      return;
    }

    try {
      const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmT7D23M1o1GDDgVjEgy4Ym1YuHePnwmN9t9552U8HD8MJ"
      const artifact = await fetch(artifactUrl).then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      });
      const { abi, bytecode } = artifact;
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.mintDID(user, `https://ipfs.io/ipfs/Qmewz5XsFkLSZkkYGTFFBXEKd6SMRmrsMkN7WF8qnGCCJM`);
      await tx.wait();
      alert(`DID minted and sent to ${user}`);

    } catch (error) {
      console.error('Minting DID failed:', error);
    }
  };

  const generateKeyPairFromSeed = (seed) => {
    const hash = createHash('sha256').update(seed).digest('hex');
    const keyPair = ec.keyFromPrivate(hash);
    return keyPair;
  };

  const encryptData = (data, publicKey) => {
    const encryptValue = (value) => {
      const sharedKey = keyPair.derive(publicKey).toString(16);
      const encrypted = CryptoJS.AES.encrypt(value, sharedKey).toString();
      return encrypted;
    };

    const encryptedData = {};
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        encryptedData[key] = encryptData(data[key], publicKey);
      } else {
        encryptedData[key] = encryptValue(data[key]);
      }
    }
    return encryptedData;
  };

  const handleEncrypt = () => {
    if (!keyPair || !idJson) return;
    const encrypted = encryptData(idJson, keyPair.getPublic());
    setEncryptedData(encrypted);
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

  return (
    <div>
      <h3>Encrypt ID</h3>
      <button onClick={handleGenerateKeyPair}>Generate Key Pair</button>
      <button onClick={handleEncrypt} disabled={!keyPair}>Encrypt ID</button>
      <button onClick={mintDID} disabled={!signer}>Mint DID</button>

      {fetchError && (
        <div className="error-popup">
          {fetchError && <p>{fetchError}</p>}
        </div>
      )}

      {Object.keys(encryptedData).length > 0 && (
        <div>
          <h4>Encrypted Data</h4>
          <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
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

export default Mint;
