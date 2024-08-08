import React, { useState, useEffect } from 'react';
import useAuth from '../Auth/UseAuth';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../App.css';

const ec = new EC.ec('p256');

const UserPage = () => {
  const { user } = useAuth();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [encryptedData, setEncryptedData] = useState({});
  const [decryptedData, setDecryptedData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [publicKeyHex, setPublicKeyHex] = useState('');
  const [privateKeyHex, setPrivateKeyHex] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [idJson, setIdJson] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [decryptError, setDecryptError] = useState('');

  useEffect(() => {
    const fetchJsonFromIPFS = async () => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/QmPGR1234AcmtQ2WUicKe9qZvFup6saDY8iccCvx1MYa5j');
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
      }, 10000);
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

    const publicKeyHex = keypair.getPublic('hex');
    const privateKeyHex = keypair.getPrivate('hex');
    setPublicKeyHex(publicKeyHex);
    setPrivateKeyHex(privateKeyHex);

    setShowModal(false);
  };

  const handleDecrypt = () => {
    if (!keyPair) return;

    if (!idJson) {
      setFetchError('Error fetching JSON from IPFS. Please try again later.');
      setTimeout(() => {
        setFetchError('');
      }, 10000)
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
      <h1>Decrypt Data</h1>
      <button onClick={handleGenerateKeyPair}>Generate Key Pair</button>
      <button onClick={handleDecrypt} disabled={!keyPair}>Decrypt Data</button>

      {(fetchError || decryptError) && (
        <div className="error-popup">
          {fetchError && <p>{fetchError}</p>}
          {decryptError && <p>{decryptError}</p>}
        </div>
      )}

      {publicKeyHex && (
        <div>
          <h2>Public Key</h2>
          <pre>{publicKeyHex}</pre>
        </div>
      )}

      {privateKeyHex && (
        <div>
          <h2>Private Key</h2>
          <pre>{privateKeyHex}</pre>
        </div>
      )}

      {Object.keys(encryptedData).length > 0 && (
        <div>
          <h2>Encrypted Data</h2>
          <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
        </div>
      )}

      {decryptedData && (
        <div>
          <h2>Decrypted Data</h2>
          <pre>{JSON.stringify(decryptedData, null, 2)}</pre>
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
