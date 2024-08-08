import React, { useState } from 'react';
import useAuth from '../Auth/UseAuth';
import { ethers } from 'ethers';
// import pinataSDK from '@pinata/sdk';
// import { encrypt } from 'eth-sig-util';
// import { bufferToHex } from 'ethereumjs-util';
// import Modal from 'react-modal';

// const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_API_KEY);

// Modal.setAppElement('#root'); // Set the root element for the modal

const Mint = () => {
//     const { signer } = useAuth();
//     const [encryptedMessage, setEncryptedMessage] = useState('');
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [name, setName] = useState('');
//     const [image, setImage] = useState('');
//     const [userPublicKey, setUserPublicKey] = useState('');
//     const [attributes, setAttributes] = useState({
//         Name: '',
//         'Place of birth': '',
//         'Issued country': '',
//         'Issued authority': '',
//         'Date of birth': '',
//         'Passport number': '',
//         Sex: '',
//         'Registration address': '',
//         'Date of issue': '',
//         'Date of expiry': ''
//     });

//     const encryptWithPublicKey = (data, publicKey) => {
//         const encrypted = bufferToHex(
//             Buffer.from(
//                 JSON.stringify(
//                     encrypt(
//                         publicKey,
//                         { data },
//                         'x25519-xsalsa20-poly1305'
//                     )
//                 ),
//                 'utf8'
//             )
//         );
//         return encrypted;
//     };

//     const handleEncryptAndUpload = async () => {
//         const data = JSON.stringify({
//             name,
//             image,
//             pubkey: userPublicKey,
//             attributes
//         });

//         try {
//             if (!userPublicKey) {
//                 throw new Error('User public key is required');
//             }

//             const encrypted = encryptWithPublicKey(data, userPublicKey);
//             setEncryptedMessage(encrypted);

//             const response = await pinata.pinJSONToIPFS({ encryptedData: encrypted });
//             console.log('IPFS hash:', response.IpfsHash);
//         } catch (error) {
//             console.error('Encryption or IPFS upload failed:', error);
//         }
//     };

//     const handleAttributeChange = (key, value) => {
//         setAttributes({ ...attributes, [key]: value });
//     };

    return (
        <>
        </>

//         <>
//             <button onClick={() => setModalIsOpen(true)}>
//                 Issue DID
//             </button>

//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={() => setModalIsOpen(false)}
//                 contentLabel="Enter JSON Data"
//             >
//                 <h2>Enter JSON Data</h2>
//                 <div>
//                     <label>
//                         Name:
//                         <input 
//                             type="text" 
//                             value={name} 
//                             onChange={(e) => setName(e.target.value)} 
//                             placeholder="Enter name" 
//                         />
//                     </label>
//                 </div>
//                 <div>
//                     <label>
//                         Image:
//                         <input 
//                             type="text" 
//                             value={image} 
//                             onChange={(e) => setImage(e.target.value)} 
//                             placeholder="Enter image link" 
//                         />
//                     </label>
//                 </div>
//                 <div>
//                     <label>
//                         User Public Key:
//                         <input 
//                             type="text" 
//                             value={userPublicKey} 
//                             onChange={(e) => setUserPublicKey(e.target.value)}

// placeholder="Enter user's public key" 
//                         />
//                     </label>
//                 </div>
//                 {Object.keys(attributes).map((key) => (
//                     <div key={key}>
//                         <label>
//                             {key}:
//                             <input 
//                                 type="text" 
//                                 value={attributes[key]} 
//                                 onChange={(e) => handleAttributeChange(key, e.target.value)} 
//                                 placeholder={Enter ${key.toLowerCase()}} 
//                             />
//                         </label>
//                     </div>
//                 ))}
//                 <button onClick={() => {
//                     handleEncryptAndUpload();
//                     setModalIsOpen(false);
//                 }}>
//                     Submit
//                 </button>
//                 <button onClick={() => setModalIsOpen(false)}>
//                     Cancel
//                 </button>
//             </Modal>
//         </>
    );
};

export default Mint;