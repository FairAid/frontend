import React, { useState, useEffect } from 'react';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../App.css';
import '../../styles/UserPage.css';
import { ethers } from 'ethers';
import { QRCodeCanvas } from 'qrcode.react';  // QRCodeCanvas 사용

const ec = new EC.ec('p256');

const UserPage = ({ signer, user }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [decryptedData, setDecryptedData] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [isIDOpen, setIsIDOpen] = useState(false);
  const [decryptedImage, setDecryptedImage] = useState(null);
  const [didUri, setDidUri] = useState(''); // DID URI 상태 추가

  const contractAddress = "0xd94464119aDe5Ce776E1B426319b5ce865E9E00e";

  const handleQRCodeClick = () => {
    setShowQRCode(!showQRCode); // QR 코드 표시 여부를 토글
  };

  const generateKeyPairFromSeed = (seed) => {
    const hash = createHash('sha256').update(seed).digest('hex');
    const keyPair = ec.keyFromPrivate(hash);
    return keyPair;
  };

  const decryptValue = (value, privateKey) => {
    const sharedKey = privateKey.derive(keyPair.getPublic()).toString(16);
    const decrypted = CryptoJS.AES.decrypt(value, sharedKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
  };

  const decryptData = async (data, privateKey) => {
    try {
      const decryptedData = {};
      for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
          decryptedData[key] = await decryptData(data[key], privateKey);
        } else {
          decryptedData[key] = decryptValue(data[key], privateKey);
        }
      }
      return decryptedData;
    } catch (error) {
      console.error('Error decrypting data:', error);
      setDecryptError('Unable to decrypt data with this key. Please enter the correct seed phrase.');
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
    setShowModal(false); // 모달 창을 숨깁니다.
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
        setFetchError("Error occurred while fetching NFT. Please check if the ID has already been issued.");
        setTimeout(() => {
          setFetchError('');
        }, 7000);
        return;
      }

      const jsonData = await fetchJsonFromIPFS(uri);
      if (!jsonData) {
        setFetchError('Error occurred while fetching JSON from IPFS. Please try again later.');
        setTimeout(() => {
          setFetchError('');
        }, 7000);
        return;
      }

      const decrypted = await decryptData(jsonData, keyPair);
      if (decrypted) {
        setDecryptedData({ ...decrypted, image: jsonData.image });
        setDecryptError('');
        setIsIDOpen(true);

        const decryptedImage = decryptValue(jsonData.image, keyPair);
        setDecryptedImage(decryptedImage);

        setDidUri(uri); // DID URI 저장
      }
    } catch (error) {
      console.error('An error occurred during decryption:', error);
      setDecryptError('An error occurred during decryption. Please try again.');
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
      console.error('Error occurred while fetching JSON from IPFS:', error);
      return null;
    }
  };

  const fetchDID = async () => {
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
      console.error('Failed to retrieve TokenID:', error);
      return null;
    }
  };

  const handleBackClick = () => {
    setIsIDOpen(false);
    setShowModal(true); // 모달 창을 다시 보여줍니다.
  };

  return (
    <div>
      <h1 className='userPage-header'>Check Your Refugee ID</h1>

      {isIDOpen && (
        <button className='back-button' onClick={handleBackClick}>
          Back
        </button>
      )}

      <div className='container'>
        {showModal && (
          <div className='border-box'>
            <div className="modal-content">
              <label className='Label'>
                Enter Your Password
                <input
                  type="password"
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                />
              </label>
              <button className='submit-button' onClick={handleSeedPhraseSubmit}>Submit</button>
            </div>
          </div>
        )}
        {(fetchError || decryptError) && (
          <div className="error-popup">
            {fetchError && <p>{fetchError}</p>}
            {decryptError && <p>{decryptError}</p>}
          </div>
        )}
        {decryptedData && isIDOpen && (
          <div className="id-card">
            <div className="id-card-header">
              <h1>Refugee Travel <br />PassPort</h1>
            </div>
            {decryptedImage && (
              <div className="img-box">
                <img src={decryptedImage} alt="ID Image" className="id-image" />
              </div>
            )}
            <div className="id-card-content">
              <div className="id-card-background"></div>
              <div className="id-card-body">
                <p><strong>Name:</strong> {decryptedData.attributes.Name}</p>
                <p><strong>Sex:</strong> {decryptedData.attributes.Sex}</p>
                <p><strong>Date of Birth:</strong> {decryptedData.attributes["Date of birth"]}</p>
                <p><strong>Nationality:</strong> {decryptedData.attributes["Place of birth"]}</p>
                <p><strong>Registration Address:</strong> {decryptedData.attributes["Registration address"]}</p>
                <p><strong>Issued Country:</strong> {decryptedData.attributes["Issued country"]}</p>
                <p><strong>Date of Issue:</strong> {decryptedData.attributes["Date of issue"]}</p>
                <p><strong>Date of Expiry:</strong> {decryptedData.attributes["Date of expiry"]}</p>
              </div>
              <div className="issued-author">
                <p style={{ fontSize: '25px', }}><strong>{decryptedData.attributes["Issued authority"]}</strong></p>
              </div>
              {/* QR 코드 버튼 */}
              <button className='qr-button' onClick={handleQRCodeClick}>
                {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              {/* QR 코드 추가 */}
              {showQRCode && didUri && (
                <div className='qr-box'>
                  <div className="qr-code-box">
                    <QRCodeCanvas value={didUri} size={128} />
                    <p>Scan this QR code to verify <br></br>the NFT PassPort</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
