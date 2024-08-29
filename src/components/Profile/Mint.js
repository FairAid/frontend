import React, { useState, useRef } from 'react';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import process from 'process';
import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import '../../styles/AdminPage.css';
import '../../styles/Mint.css'; // 새로운 CSS 파일 임포트

const ec = new EC.ec('p256');

const Mint = ({signer, user}) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mintError, setMintError] = useState('');
  const [uploading, setUploading] = useState(false); // 업로드 상태 관리
  // const contractAddress = "0x05cD72Ff4cdc6045B59434cD5453779A2Ae7f9cf";  
  const contractAddress = "0xd94464119aDe5Ce776E1B426319b5ce865E9E00e"; // 라다님꺼

  // Input variables
  const userPubkeyRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);
  const birthplaceRef = useRef(null);
  const issuedCountryRef = useRef(null);
  const issuedAuthorityRef = useRef(null);
  const birthDateRef = useRef(null);
  const sexRef = useRef(null);
  const addressRef = useRef(null);
  const issueDateRef = useRef(null);
  const expiryDateRef = useRef(null);

  const issueID = async () => {
    const userPubkey = userPubkeyRef.current.value;
    const name = nameRef.current.value;
    const birthplace = birthplaceRef.current.value;
    const issuedCountry = issuedCountryRef.current.value;
    const issuedAuthority = issuedAuthorityRef.current.value;
    const birthDate = birthDateRef.current.value;
    const sex = sexRef.current.value;
    const address = addressRef.current.value;
    const issueDate = issueDateRef.current.value;
    const expiryDate = expiryDateRef.current.value;

    setUploading(true);

    try {
      // 이미지 업로드
      const file = imageRef.current.files[0];
      if (!file) {
        alert('Please select an image file.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
      const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = `Failed to upload image. Status: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const imageURL = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

      // 다른 데이터와 함께 처리
      const data = {
        name: "FairAid DID",
        image: imageURL,
        attributes: {
          Name: name,
          "Place of birth": birthplace,
          "Issued country": issuedCountry,
          "Issued authority": issuedAuthority,
          "Date of birth": birthDate,
          "Sex": sex,
          "Registration address": address,
          "Date of issue": issueDate,
          "Date of expiry": expiryDate
        }
      };

      if (!keyPair || !data) {
        alert("Cannot generate key pair and encrypt data.");
        setShowIssueModal(false);
        setUploading(false);
        return;
      }

      const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmcEUv17JcLE9SxRbSyhmByx5C7oHh7Z1zAT1rQXZkuuq5";
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

      const jsonResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
        body: JSON.stringify(encrypted_json)
      });

      const jsonResult = await jsonResponse.json();
      const uri = `https://gateway.pinata.cloud/ipfs/${jsonResult.IpfsHash}`;

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
    } finally {
      setUploading(false);
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
              className="close-button"
            >
              &times;
            </span>
            <div className="modal-password">
              <label>
                Set Your Passsword
                <input
                  type="password"
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                />
              </label>
            </div>
            <button className='submit-button' onClick={handleSeedPhraseSubmit}>Submit</button>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div className="edit-id-modal">
          <div className="edit-id-modal-content">
            <span
              onClick={handleCloseIssueModal}
              className="close-button"
            >
              &times;
            </span>
            <h3>Edit Details</h3>
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
                    type="file"
                    ref={imageRef}
                    disabled={uploading}
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
                  <select ref={issuedAuthorityRef}>
                    <option value="Seoul Immigration Office">Seoul Immigration Office</option>
                    <option value="Busan Immigration Office">Busan Immigration Office</option>
                    <option value="Incheon Immigration Office">Incheon Immigration Office</option>
                  </select>
                </label>
              </div>
              <div className="right-column">
                <label>
                  Sex
                  <select ref={sexRef}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
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
                    type="date"
                    ref={issueDateRef}
                    placeholder="Issue Date"
                  />
                </label>
                <label>
                  Expiry Date
                  <input
                    type="date"
                    ref={expiryDateRef}
                    placeholder="Expiry Date"
                  />
                </label>
                <label>
                  Birth Date
                  <input
                    type="date"
                    ref={birthDateRef}
                    placeholder="Birth Date"
                  />
                </label>
                <button style={{ float: "right" }} onClick={issueID} disabled={uploading}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mint;
