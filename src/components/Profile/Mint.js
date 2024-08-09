// seed: anotherseed
// HEX pubkey: 04ed577161a2083139b081b1b3fc47ce425e9fad6c2cc6d07068300428662365fba033427bcd9db3af460468cdf438b6e12cd03fa8bea5b9c35bc73a458801b971
import React, { useState, useEffect } from 'react';
import useAuth from '../Auth/UseAuth';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../App.css';
import '../../styles/UserPage.css';

const ec = new EC.ec('p256');

const UserPage = () => {
  const { user } = useAuth();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [encryptedData, setEncryptedData] = useState({});
  const [keyPair, setKeyPair] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [idJson, setIdJson] = useState(null);
  const [fetchError, setFetchError] = useState('');

  const publicKeyHex = "048cebbcc692a05c8451b171e627dc7a70e7125a429c2f36c08d2c2ddf731c1e3069fdab6957946c9656801c66a3331c3921856d31ca5cb88abb1a7b2d055eb4fa"

  useEffect(() => {
    const fetchJsonFromIPFS = async () => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/Qmb9NDjS7FvjaAjmN2UPak7N8qrE6HLYJLdetBdtKApMFE');
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
    // Decode another public key
    const decodedPubkey = ec.keyFromPublic(publicKeyHex, 'hex').getPublic();
    // Instead of keyPair.getPublic() use decodedPubkey
    const encrypted = encryptData(idJson, decodedPubkey);
    setEncryptedData(encrypted);
    console.log("Public key: ", keyPair.getPublic().encode('hex'));
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

export default UserPage;
