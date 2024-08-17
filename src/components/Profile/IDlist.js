import React, { useState, useEffect, useRef } from 'react';
import { ethers } from "ethers";
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';
import CryptoJS from 'crypto-js';
import '../../styles/AdminPage.css';
import process from 'process';  

const ec = new EC.ec('p256');

const ListOfIDs = ({ signer }) => {
    const contractAddress = "0xd94464119aDe5Ce776E1B426319b5ce865E9E00e";
    const [addressesList, setAddressesList] = useState([]);
    const [tokenIdList, setTokenIdList] = useState({});
    const [contractInst, setContractInst] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [revokeError, setRevokeError] = useState('');
    const [currentTokenID, setCurrentTokenID] = useState();
    const [keyPair, setKeyPair] = useState(null);
    const [seedPhrase, setSeedPhrase] = useState('');

    // Input variables
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

    const getIdList = async () => {
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
            setContractInst(contract);

            const addresses = await contract.getAllAddresses();
            console.log('Addresses fetched:', addresses);
            setAddressesList(addresses);

            // Fetch all Token IDs for the addresses
            const tokenIdPromises = addresses.map(async (address) => {
                try {
                    const tokenId = await contract.findDID(address);
                    console.log(`Token ID for ${address}:`, tokenId);
                    return { address, tokenId: tokenId.toString() }; // Convert BigInt to string
                } catch (error) {
                    console.error(`Error fetching Token ID for ${address}:`, error);
                    return { address, tokenId: "Error fetching ID" };
                }
            });

            const tokenIdResults = await Promise.all(tokenIdPromises);

            // Map addresses to their token IDs
            const tokenIdMap = {};
            tokenIdResults.forEach(({ address, tokenId }) => {
                tokenIdMap[address] = tokenId;
            });

            console.log('Token ID Map:', tokenIdMap);
            setTokenIdList(tokenIdMap);
        } catch (error) {
            console.error('Error in getIdList:', error);
        }
    };

    useEffect(() => {
        getIdList();
    }, []);

    const editID = async() => {
        if (!tokenIdList || !contractInst) {
            return;
        }

        if (!currentTokenID) {
            alert("No Token ID selected!");
            return;
        }

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
            const updated_json = {
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

            if (!keyPair || !updated_json) {
                alert("Cannot generate key pair and encrypt data.");
                setShowEditModal(false);
                return; 
            }

            const encrypted_json = encryptData(updated_json, keyPair.getPublic());
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
            console.log("Current token ID: ", currentTokenID);

            const result = await response.json();

            const uri = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
            const updateURI = await contractInst.updateTokenURI(currentTokenID, uri);
            await updateURI.wait();
            setShowEditModal(false);
            alert(`ID number ${currentTokenID} updated successfully! New URI: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
        } catch(error) {
            console.log("Update error: ", error);
            setUpdateError(
                'Error updating DID.'
              );
              setTimeout(() => {
                setUpdateError('');
              }, 7000);
              return;
        }
    }

    const handleEditID = (ID) => {
        handleGenerateKeyPair();
        console.log('Setting currentTokenID:', ID);
        setCurrentTokenID(ID);
    };

    const handleRevokeID = (ID) => {
        console.log('Setting currentTokenID:', ID);
        setCurrentTokenID(ID);
        setShowRevokeModal(true);
    };

    const handleCloseRevokeModal = () => {
        setShowRevokeModal(false);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const generateKeyPairFromSeed = (seed) => {
        const hash = createHash('sha256').update(seed).digest('hex');
        const keyPair = ec.keyFromPrivate(hash);
        return keyPair;
    };

    const handleGenerateKeyPair = () => {
        setShowPasswordModal(true);
    };

    const handleSeedPhraseSubmit = () => {
        if (!seedPhrase) return;
        const keypair = generateKeyPairFromSeed(seedPhrase);
        setKeyPair(keypair);
    
        setShowPasswordModal(false);
        setShowEditModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
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

    const revokeID = async() => {
        if (!tokenIdList || !contractInst) {
            return;
        }

        if (!currentTokenID) {
            alert("No Token ID selected!");
            return;
        }

        try {
            const burnID = await contractInst.burnDID(currentTokenID);
            await burnID.wait();
            setShowRevokeModal(false);
            alert(`ID number ${currentTokenID} was revoked!`);
        } catch(error) {
            console.log("Revoke error: ", error);
            setRevokeError(
                'Error! Could not revoke ID.'
              );
              setTimeout(() => {
                setRevokeError('');
              }, 7000);
              return;
        }
    }

    return (
        <>
            <h3>List of all issued IDs.</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Address</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Token ID</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Manage</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Revoke ID</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Expiration</th>
                    </tr>
                </thead>
                <tbody>
                    {addressesList.map((address, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>{address}</td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>
                                {tokenIdList[address] !== undefined ? tokenIdList[address] : "Loading..."}
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>
                                <button onClick={() => handleEditID(tokenIdList[address])}>Edit ID</button>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>
                                <button onClick={() => handleRevokeID(tokenIdList[address])}>Revoke ID</button>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>{/* expiration */}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {updateError && (
                <div className="error-popup">
                    {updateError && <p>{updateError}</p>}
                </div>
            )}

            {revokeError && (
                <div className="error-popup">
                    {revokeError && <p>{revokeError}</p>}
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

            {showRevokeModal && (
                <div className="modal">
                <div className="modal-content">
                    <span 
                    onClick={handleCloseRevokeModal}
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
                    <h3>Are you sure you want to revoke your ID?</h3>
                    <button className='submit-button' onClick={revokeID}>Yes, revoke ID</button>
                </div>
                </div>
            )}

            {showEditModal && (
                <div className="edit-id-modal">
                    <div className="edit-id-modal-content">
                        <span 
                            onClick={handleCloseEditModal}
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
                        <h3>Edit Details</h3>
                        <div className="form-container">
                            <div className="left-column">
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
                                <label>
                                    Birth Date
                                    <input 
                                        type="text" 
                                        ref={birthDateRef}
                                        placeholder="Birth Date"
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
                                <button style={{ float: "right"}} onClick={editID}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListOfIDs;
