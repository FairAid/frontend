import React, { useState, useRef } from 'react';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import process from 'process';  
import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import '../../styles/AdminPage.css';

const ec = new EC.ec('p256');

const Mint = ({signer}) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mintError, setMintError] = useState('');
  const contractAddress = "0xd94464119aDe5Ce776E1B426319b5ce865E9E00e"

  // Input variables
  const userPubkeyRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);
  const birthplaceRef = useRef(null);
  const issuedCountryRef = useRef(null);
  const issuedAuthorityRef = useRef(null);
  const birthDateRef = useRef(null);
  const passportNumberRef = useRef(null);
  const sexRef = useRef(null);
  const addressRef = useRef(null);
  const issueDateRef = useRef(null);
  const expiryDateRef = useRef(null);

  const issueID = async() => {
    const userPubkey = userPubkeyRef.current.value;
    const image = imageRef.current.value;
    const name = nameRef.current.value;
    const birthplace = birthplaceRef.current.value;
    const issuedCountry = issuedCountryRef.current.value;
    const issuedAuthority = issuedAuthorityRef.current.value;
    const birthDate = birthDateRef.current.value;
    const passportNumber = passportNumberRef.current.value;
    const sex = sexRef.current.value;
    const address = addressRef.current.value;
    const issueDate = issueDateRef.current.value;
    const expiryDate = expiryDateRef.current.value;

    try {
      const data = {
        "name": "FairAid DID",
        "image": image,
        "attributes": {
          "Name": name,
          "Place of birth": birthplace,
          "Issued country": issuedCountry,
          "Issued authority": issuedAuthority,
          "Date of birth": birthDate,
          "Passport number": passportNumber,
          "Sex": sex,
          "Registration address": address,
          "Date of issue": issueDate,
          "Date of expiry": expiryDate
        }
      }

      if (!keyPair || !data) {
        alert("Cannot generate key pair and encrypt data.");
        setShowIssueModal(false);
        return; 
      }

      const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmcEUv17JcLE9SxRbSyhmByx5C7oHh7Z1zAT1rQXZkuuq5"
      const artifact = await fetch(artifactUrl).then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      });
      const { abi } = artifact;
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const encrypted_json = encryptData(data, keyPair.getPublic());
      console.log("Encrypted json: ", encrypted_json);

      const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
      const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
        },
        body: JSON.stringify(encrypted_json)
      });

      console.log('PINATA_API_KEY:', pinataApiKey);
      console.log('PINATA_SECRET_API_KEY:', pinataSecretApiKey);

      const result = await response.json();

      const uri = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

      const tx = await contract.mintDID(userPubkey, uri);
      await tx.wait();
      setShowIssueModal(false);
      alert(`DID minted and sent to ${userPubkey}. URI: ${uri}`);

    } catch (error) {
      console.error('Minting DID failed due to:', error);
      setMintError(
        'Error issuing DID. Note, that IDs cannot be issued twice for the same address.'
      );
      setTimeout(() => {
        setMintError('');
      }, 7000);
      return;
    }
  };

  const generateKeyPairFromSeed = (seed) => {
    const hash = createHash('sha256').update(seed).digest('hex');
    const keyPair = ec.keyFromPrivate(hash);
    return keyPair;
  };

  const handleGenerateKeyPair = () => {
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handleCloseIssueModal = () => {
    setShowIssueModal(false);
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

  const handleSeedPhraseSubmit = () => {
    if (!seedPhrase) return;
    const keypair = generateKeyPairFromSeed(seedPhrase);
    setKeyPair(keypair);

    setShowPasswordModal(false);
    setShowIssueModal(true);
  };

  return (
    <div>
      <button onClick={handleGenerateKeyPair} disabled={!signer}>Issue ID</button>
      
      {mintError && (
        <div className="error-popup">
          {mintError && <p>{mintError}</p>}
        </div>
      )}

      {showPasswordModal && (
        <div className="modal">
        <div className="modal-content">
            <span 
            onClick={handleClosePasswordModal}
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '20px',
                cursor: 'pointer'
            }}
            >
                &times;
            </span>
            <label>
            Enter password
            <input 
                type="text" 
                value={seedPhrase} 
                onChange={(e) => setSeedPhrase(e.target.value)} 
            />
            </label>
            <button className='submit-button' onClick={handleSeedPhraseSubmit}>Submit</button>
        </div>
        </div>
      )}

      {showIssueModal && (
        <div className="edit-id-modal">
            <div className="edit-id-modal-content">
                <span 
                    onClick={handleCloseIssueModal}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </span>
                <h3>Enter personal details</h3>
                <div className="form-container">
                    <div className="left-column">
                        <label>
                            MetaMask public key
                            <input 
                                type="text" 
                                ref={userPubkeyRef}
                                placeholder="Public Key"
                            />
                        </label>
                        <label>
                            Image
                            <input 
                                type="text" 
                                ref={imageRef}
                                placeholder="Image"
                            />
                        </label>
                        <label>
                            Name
                            <input 
                                type="text" 
                                ref={nameRef}
                                placeholder="Name"
                            />
                        </label>
                        <label> 
                            Place of birth
                            <input 
                                type="text" 
                                ref={birthplaceRef}
                                placeholder="Birthplace"
                            />
                        </label>
                        <label>
                            Issued country
                            <input 
                                type="text" 
                                ref={issuedCountryRef}
                                placeholder="Issued country"
                            />
                        </label>
                        <label>
                            Issued Authority
                            <input 
                                type="text" 
                                ref={issuedAuthorityRef}
                                placeholder="Issued authority"
                            />
                        </label>
                    </div>
                    <div className="right-column">
                        <label>
                            Passport Number
                            <input 
                                type="text" 
                                ref={passportNumberRef}
                                placeholder="Passport Number"
                            />
                        </label>
                        <label>
                            Sex
                            <input 
                                type="text" 
                                ref={sexRef}
                                placeholder="Sex"
                            />
                        </label>
                        <label>
                            Address
                            <input 
                                type="text" 
                                ref={addressRef}
                                placeholder="Address"
                            />
                        </label>
                        <label>
                            Issue Date
                            <input 
                                type="text" 
                                ref={issueDateRef}
                                placeholder="Issue Date"
                            />
                        </label>
                        <label>
                            Expiry Date
                            <input 
                                type="text" 
                                ref={expiryDateRef}
                                placeholder="Expiry Date"
                            />
                        </label>
                        <label>
                            Birth Date
                            <input 
                                type="text" 
                                ref={birthDateRef}
                                placeholder="Birth Date"
                            />
                        </label>
                        <button style={{ float: "right"}} onClick={issueID}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Mint;