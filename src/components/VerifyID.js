import React, { useState } from "react";
import { ethers } from 'ethers';
import "../App.css";

const officeData = {
  "Seoul immigration office": "0xfd1F5B5F618313E19fA0eA3eEFAb422337AF4f99",
  "Incheon immigration office": "0x4ABBC96d0cA35A243C3624549Ae2B737E9344E7D",
  "Busan immigration office": "0x5Ea4580d5E4a30aEa425ecBd8B2c6531804B5deF"
};

function VerifyID() {
    const [userAddress, setUserAddress] = useState('');
    const [tokenID, setTokenID] = useState('');
    const [issuerAddress, setIssuerAddress] = useState('');
    const [issuerOffice, setIssuerOffice] = useState('');  
    const [transactionHash, setTransactionHash] = useState('');

    const contractAddress = "0xA2E34B9a903FF2D9B72893b949ee6523fc679b55";

    const findID = async() => {
        try {
            const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmT7D23M1o1GDDgVjEgy4Ym1YuHePnwmN9t9552U8HD8MJ";
            const artifact = await fetch(artifactUrl).then(response => response.json());
            const { abi } = artifact;
            const provider = new ethers.JsonRpcProvider('https://arb-sepolia.g.alchemy.com/v2/R_b4eb8IhQuhtGRqEPJJoHe_FUmQ4pAD');
            const contract = new ethers.Contract(contractAddress, abi, provider);
            
            // Fetch token ID and issuer address
            const token = await contract.findDID(String(userAddress));
            const issuer = await contract.owner();

            // Set both states at once to trigger a single re-render
            setTokenID(token);
            setIssuerAddress(issuer);

            // Check if the issuerAddress exists in the JSON file
            const officeName = Object.keys(officeData).find(key => officeData[key].toLowerCase() === issuer.toLowerCase());
            if (officeName) {
                setIssuerOffice(officeName);
            } else {
                setIssuerOffice('Unknown Office. The ID may be invalid.');
            }

            // Fetch the transaction where this token was minted
            const filter = contract.filters.Transfer(null, userAddress, token);
            const logs = await provider.getLogs({
                fromBlock: 0,
                toBlock: 'latest',
                address: contractAddress,
                topics: filter.topics
            });

            if (logs.length > 0) {
                const txHash = logs[0].transactionHash;
                setTransactionHash(txHash);
            }

        } catch (error) {
            console.error('Fetching TokenID or Issuer Address failed:', error);
            alert('Fetching TokenID or Issuer Address failed');
        }
    }

    return (
        <div>
            <h1>This is a VerifyID page.</h1>
            <div>
                <h2>Enter ID owner's MetaMask address: </h2>
                <input 
                    type="text" 
                    value={userAddress} 
                    onChange={(e) => setUserAddress(e.target.value)} 
                />
                <button onClick={findID}>Submit</button>
            </div>

            {userAddress && tokenID && issuerAddress && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Address</th>
                            <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>ID #</th>
                            <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Issuer Address</th>
                            <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Issuer Office</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>{userAddress}</td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>{tokenID.toString()}</td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>{issuerAddress}</td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>{issuerOffice}</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {transactionHash && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <a 
                        href={`https://sepolia.arbiscan.io/tx/${transactionHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'white', backgroundColor: '#007bff', padding: '10px 20px', borderRadius: '5px' }}
                    >
                        View the transaction on Etherscan
                    </a>
                </div>
            )}

        </div>
    );
}

export default VerifyID;
