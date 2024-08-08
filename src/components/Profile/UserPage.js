import React, { useState } from 'react';
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

  const idJson = {
    "name": "FairAid DID",
    "image": "ipfs://Qm... (link to image)",
    "pubkey": "0x546742249871",
    "attributes": {
      "Name": "Alice",
      "Place of birth": "Russia",
      "Issued country": "South Korea",
      "Issued authority": "Immigration office #125",
      "Date of birth": "1995.02.16",
      "Passport number": "35678522",
      "Sex": "F",
      "Registration address": "South Korea, Seoul, Green street, 15",
      "Date of issue": "2024.02.15",
      "Date of expiry": "2027.02.15"
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

  const decryptData = (data, privateKey) => {
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

  const handleEncrypt = () => {
    if (!keyPair || !idJson) return;
    const encrypted = encryptData(idJson, keyPair.getPublic());
    setEncryptedData(encrypted);
  };

  const handleDecrypt = () => {
    if (!keyPair || !idJson) return;
    const decrypted = decryptData(encryptedData, keyPair);
    setDecryptedData(decrypted);
  };

  return (
    <div>
      <h1>Encrypt/Decrypt Data</h1>
      <button onClick={handleGenerateKeyPair}>Generate Key Pair</button>
      <button onClick={handleEncrypt} disabled={!keyPair}>Encrypt Data</button>
      <button onClick={handleDecrypt} disabled={!keyPair}>Decrypt Data</button>

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
