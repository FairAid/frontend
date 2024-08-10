import React, { useState } from 'react';
import { ethers } from "ethers";

const Deploy = ({signer}) => {
    const [deployedContractAddress, setDeployedContractAddress] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);

    const deployContract = async () => {
        if (!signer) {
            alert('Please connect to MetaMask to deploy the contract!');
            return;
        }

        try {
            setIsDeploying(true);
            
            const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmT7D23M1o1GDDgVjEgy4Ym1YuHePnwmN9t9552U8HD8MJ"
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
            // Debug: the alert doesn't show the contract address when deployed for the first time
            alert("Contract deployed at: " +  String(deployedContractAddress));
            console.log(contract.target);
        } catch (error) {
            setIsDeploying(false);
            alert(`Failed to deploy contract: ${error.message}`);
        }
    };

    return (
        <>
            {deployedContractAddress ? (
                <button onClick={deployContract} disabled={isDeploying}>
                    {isDeploying ? 'Deploying Contract...' : 'Deploy again'}
                </button> 
            ) : (
                <button onClick={deployContract} disabled={isDeploying}>
                    {isDeploying ? 'Deploying Contract...' : 'Deploy Contract'}
                </button>  
            )}
        </>
    );
};

export default Deploy;

