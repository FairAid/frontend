import React, { useState } from 'react';
import useAuth from '../Auth/UseAuth';
import { encrypt, decrypt } from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes, bytesToUtf8 } from 'ethereum-cryptography/utils';
import { ethers } from 'ethers';

const Mint = () => {
    // const { signer } = useAuth();
    // const publicKey = `${signer.address}`;
    // const privateKey = 'random private key';
    // console.log(signer.address); // MetaMask address is the public key

    // const data = {
    //     "name": "Example NFT",
    //     "description": "This is an example NFT",
    //     "image": "ipfs://Qm... (link to image)",
    //     "attributes": [
    //       {
    //         "trait_type": "Background",
    //         "value": "Blue"
    //       },
    //       {
    //         "trait_type": "Rarity",
    //         "value": "Rare"
    //       }
    //     ]
    //   }

    // const [encryptedMessage, setEncryptedMessage] = useState('');
    // const [decryptedMessage, setDecryptedMessage] = useState('');
  
    // const encryptWithPublicKey = (data, publicKey) => {
    //     const pubKey = ethers.utils.arrayify(publicKey);
    //     const messageBytes = utf8ToBytes(data);
    //     const encrypted = encrypt(pubKey, messageBytes);
    //     return toHex(encrypted);
    // };
    // const encrypted = encryptWithPublicKey(data, publicKey);
    // setEncryptedMessage(encrypted);
    // console.log(encryptedMessage);
  
    // const decryptWithPrivateKey = (encryptedData, privateKey) => {
    //     const privKey = ethers.utils.arrayify(privateKey);
    //     const encryptedBytes = ethers.utils.arrayify(encryptedData);
    //     const decrypted = decrypt(privKey, encryptedBytes);
    //     return bytesToUtf8(decrypted);
    // };
    // const decrypted = decryptWithPrivateKey(encryptedMessage, privateKey);
    // setDecryptedMessage(decrypted);
    // console.log(decryptedMessage);

    return (
        <>
            <button>
                Issue DID
            </button>
        </>
    );
};

export default Mint;