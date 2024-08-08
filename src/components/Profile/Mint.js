import React, { useState } from 'react';
import useAuth from '../Auth/UseAuth';
import { ethers } from 'ethers';
// import pinataSDK from '@pinata/sdk';
import forge from 'node-forge';
import Modal from 'react-modal';

// const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_API_KEY); //.env 파일 생성하고 그 파일에 입력하면 됨

// Modal.setAppElement('#root');

const Mint = () => {
    // const { signer } = useAuth();
    // const [modalIsOpen, setModalIsOpen] = useState(false);
    // const [userPublicKey, setUserPublicKey] = useState(localStorage.getItem('publicKey') || '');
    // const [attributes, setAttributes] = useState({
    //     name: '',
    //     placeOfBirth: '',
    //     issuedCountry: '',
    //     issuedAuthority: '',
    //     dateOfBirth: '',
    //     passportNumber: '',
    //     sex: '',
    //     registrationAddress: '',
    //     dateOfIssue: '',
    //     dateOfExpiry: ''
    // });

    // const encryptData = (data, publicKey) => {
    //     const encryptValue = (value) => {
    //         const encrypted = publicKey.encrypt(forge.util.encodeUtf8(value), 'RSA-OAEP');
    //         return forge.util.encode64(encrypted);
    //     };

    //     const encryptedData = {};
    //     for (const key in data) {
    //         if (typeof data[key] === 'object' && data[key] !== null) {
    //             encryptedData[key] = encryptData(data[key], publicKey);
    //         } else {
    //             encryptedData[key] = encryptValue(data[key]);
    //         }
    //     }
    //     return encryptedData;
    // };

    // const handleEncryptAndUpload = async () => {
    //     if (!userPublicKey) {
    //         alert('Please provide the user public key!');
    //         return;
    //     }

    //     const publicKey = forge.pki.publicKeyFromPem(userPublicKey);
    //     const encrypted = encryptData(attributes, publicKey);

    //     try {
    //         const result = await pinata.pinJSONToIPFS(encrypted);
    //         const cid = result.IpfsHash;
    //         console.log('IPFS CID:', cid);

    //         await mintNFT(cid);

    //     } catch (error) {
    //         console.error('Encryption or IPFS upload failed:', error);
    //     }
    // };

    // const mintNFT = async (cid) => {
    //     if (!signer) {
    //         alert('Please connect to MetaMask to mint the NFT!');
    //         return;
    //     }

    //     try {
    //         // update with actual contract ABI and address. Deploy.js에서 가져오면 될 것 같음
    //         const contractAddress = '0xYourContractAddress';
    //         const abi = [ /* contract ABI */ ];
    //         const contract = new ethers.Contract(contractAddress, abi, signer);

    //         const tx = await contract.mintNFT(userPublicKey, `ipfs://${cid}`);
    //         await tx.wait();
    //         alert(`NFT minted and sent to ${userPublicKey}`);
    //     } catch (error) {
    //         console.error('Minting NFT failed:', error);
    //     }
    // };

    // const handleAttributeChange = (key, value) => {
    //     setAttributes({ ...attributes, [key]: value });
    // };

    return (
        <>
        </>
        // <>
        //     <button onClick={() => setModalIsOpen(true)}>
        //         Issue DID
        //     </button>

        //     <Modal
        //         isOpen={modalIsOpen}
        //         onRequestClose={() => setModalIsOpen(false)}
        //         contentLabel="Enter Refugee Data"
        //     >
        //         <h2>Enter Refugee Data</h2>
        //         {Object.keys(attributes).map((key) => (
        //             <div key={key}>
        //                 <label>
        //                     {key}:
        //                     <input 
        //                         type="text" 
        //                         value={attributes[key]} 
        //                         onChange={(e) => handleAttributeChange(key, e.target.value)} 
        //                         placeholder={`Enter ${key.toLowerCase()}`} 
        //                     />
        //                 </label>
        //             </div>
        //         ))}
        //         <div>
        //             <label>
        //                 User Public Key:
        //                 <input 
        //                     type="text" 
        //                     value={userPublicKey} 
        //                     onChange={(e) => setUserPublicKey(e.target.value)}
        //                     placeholder="Enter user's public key" 
        //                 />
        //             </label>
        //         </div>
        //         <button onClick={() => {
        //             handleEncryptAndUpload();
        //             setModalIsOpen(false);
        //         }}>
        //             Submit
        //         </button>
        //         <button onClick={() => setModalIsOpen(false)}>
        //             Cancel
        //         </button>
        //     </Modal>
        // </>
    );
};

export default Mint;
