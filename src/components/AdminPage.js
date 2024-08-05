// Contract deployed at: 0x75F1b4C6DF2f4D6338D38f1d8E6D51BB31C003dc

import React, { useState } from 'react';
import { ethers } from "ethers";
import useAuth from './UseAuth';

const AdminPage = () => {
    const [deployedContractAddress, setDeployedContractAddress] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const { signer } = useAuth(); // Use the signer from useAuth

    const deployContract = async () => {
        if (!signer) {
            alert('Please connect to MetaMask to deploy the contract!');
            return;
        }

        try {
            setIsDeploying(true);
            
            const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmUcRT77HCg7fTvB1HmZUmzvgFAUxi7U4XMDnKt9ydApLo"
            const artifact = await fetch(artifactUrl).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
            const { abi, bytecode } = artifact;

            const factory = new ethers.ContractFactory(abi, bytecode, signer);
            const contract = await factory.deploy(); // Add constructor arguments inside deploy() if necessary

            await contract.waitForDeployment(); // Wait for the contract to be mined

            setDeployedContractAddress(contract.target);
            setIsDeploying(false);
            alert(`Contract deployed at: ${deployedContractAddress}`);
            console.log(contract.target);
        } catch (error) {
            setIsDeploying(false);
            alert(`Failed to deploy contract: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Admin Page</h1>
            {deployedContractAddress ? (
                <button onClick={deployContract} disabled={isDeploying}>
                    {isDeploying ? 'Deploying Contract...' : 'Deploy again'}
                </button> 
            ) : (
                <button onClick={deployContract} disabled={isDeploying}>
                    {isDeploying ? 'Deploying Contract...' : 'Deploy Contract'}
                </button>  
            )}
        </div>
    );
};

export default AdminPage;

