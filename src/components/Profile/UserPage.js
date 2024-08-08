import React, { useState, useEffect } from 'react';
import useAuth from '../Auth/UseAuth';
import { Buffer } from 'buffer';
import { createHash, publicEncrypt, privateDecrypt } from 'crypto-browserify';
import forge from 'node-forge';

const UserPage = () => {
  // const idData = {
  //     "name": "FairAid DID",
  //     "image": "ipfs://Qm... (link to image)",
  //     "pubkey": "0x546742249871",
  //     "attributes": {
  //         "Name": "Alice",
  //         "Place of birth": "Russia",
  //         "Issued country": "South Korea",
  //         "Issued authority": "Immigration office #125",
  //         "Date of birth": "1995.02.16",
  //         "Passport number": "35678522",
  //         "Sex": "F",
  //         "Registration address": "South Korea, Seoul, Green street, 15",
  //         "Date of issue": "2024.02.15",
  //         "Date of expiry": "2027.02.15"
  //     }
  // }
  const idData = "mydata";

  const { user } = useAuth();
  const seedPhrase = "my seed phrase";
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');

  const generateKeyPairFromSeed = (seed) => {
    // Hash the seed to get a deterministic key
    const hash = createHash('sha256').update(seed).digest();
    const rng = forge.random.createInstance();

    rng.seedFileSync = () => hash;
  
    // Generate a key pair using the hash as the seed
    const keyPair = forge.pki.rsa.generateKeyPair({
      bits: 2048,
      e: 0x10001,
      workerScript: 'prime.worker.js',
      rng: rng,
    });
  
    return keyPair;
  };

  const encryptData = (data, publicKey) => {
    const json = JSON.stringify(data);
    const encrypted = publicKey.encrypt(forge.util.encodeUtf8(json), 'RSA-OAEP');
    return forge.util.encode64(encrypted);
  };
  
  const decryptData = (encryptedData, privateKey) => {
    const encrypted = forge.util.decode64(encryptedData);
    const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');
    return JSON.parse(forge.util.decodeUtf8(decrypted));
  };
  
  const handleGenerateKeyPair = () => {
    const keypair = generateKeyPairFromSeed(seedPhrase);
    setKeyPair(keypair);

    // To display private and public keys you need to convert them to pem format first
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    setPublicKeyPem(publicKeyPem);
    setPrivateKeyPem(privateKeyPem);
  };

  const handleEncrypt = () => {
    if (!keyPair) return;
    const encrypted = encryptData(idData, keyPair.publicKey);
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
      <button onClick={handleDecrypt} disabled={!encryptedData}>Decrypt Data</button>

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

      {encryptedData && (
        <div>
          <h2>Encrypted Data</h2>
          <pre>{encryptedData}</pre>
        </div>
      )}

      {decryptedData && (
        <div>
          <h2>Decrypted Data</h2>
          <pre>{JSON.stringify(decryptedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserPage;
