import React, { useState } from 'react';
import useAuth from '../Auth/UseAuth';
import { createHash } from 'crypto-browserify';
import forge from 'node-forge';
import '../../App.css';

const UserPage = () => {
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

  const { user } = useAuth();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [encryptedData, setEncryptedData] = useState({});
  const [decryptedData, setDecryptedData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [showModal, setShowModal] = useState(false);

  const generateKeyPairFromSeed = (seed) => {
    const hash = createHash('sha256').update(seed).digest();
    const rng = forge.random.createInstance();
    rng.seedFileSync = () => hash;
    const keyPair = forge.pki.rsa.generateKeyPair({
      bits: 2048,
      e: 0x10001,
      workerScript: 'prime.worker.js',
      rng: rng,
    });
    return keyPair;
  };

  const encryptData = (data, publicKey) => {
    const encryptValue = (value) => {
      const encrypted = publicKey.encrypt(forge.util.encodeUtf8(value), 'RSA-OAEP');
      return forge.util.encode64(encrypted);
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
      const encrypted = forge.util.decode64(value);
      const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');
      return forge.util.decodeUtf8(decrypted);
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

    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    setPublicKeyPem(publicKeyPem);
    setPrivateKeyPem(privateKeyPem);

    setShowModal(false);
  };

  const handleEncrypt = () => {
    if (!keyPair) return;
    const encrypted = encryptData(idJson, keyPair.publicKey);
    setEncryptedData(encrypted);
  };

  const handleDecrypt = () => {
    if (!keyPair) return;
    const decrypted = decryptData(encryptedData, keyPair.privateKey);
    setDecryptedData(decrypted);
  };

  return (
    <div>
      <h1>Encrypt/Decrypt Data</h1>
      <button onClick={handleGenerateKeyPair}>Generate Key Pair</button>
      <button onClick={handleEncrypt} disabled={!keyPair}>Encrypt Data</button>
      <button onClick={handleDecrypt} disabled={!Object.keys(encryptedData).length}>Decrypt Data</button>

      {publicKeyPem && (
        <div>
          <h2>Public Key</h2>
          <pre>{publicKeyPem}</pre>
        </div>
      )}

      {privateKeyPem && (
        <div>
          <h2>Private Key</h2>
          <pre>{privateKeyPem}</pre>
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
