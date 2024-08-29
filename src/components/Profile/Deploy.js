import React, { useState } from 'react';
import { ethers } from "ethers";


const Deploy = ({signer, user}) => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployedContractAddress, setDeployedContractAddress] = useState(false);

    const deployContract = async () => {
        if (!signer) {
            alert('Please connect to MetaMask to deploy the contract!');
            return;
        }

        try {
            setIsDeploying(true);
            
            const artifactUrl = "https://gateway.pinata.cloud/ipfs/QmcEUv17JcLE9SxRbSyhmByx5C7oHh7Z1zAT1rQXZkuuq5"
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

            setIsDeploying(false);
            setDeployedContractAddress(contract.target);

            alert("Contract deployed at: " +  String(contract.target));
            console.log("DeplpoyedContractAddress: ", contract.target);
        } catch (error) {
            setIsDeploying(false);
            alert(`Failed to deploy contract: ${error.message}`);
        }
    };

    return (
        <>
            {deployedContractAddress ? (
                <button className='deploy-button' onClick={deployContract} disabled={isDeploying}>
                    {isDeploying ? 'Deploying Contract...' : 'Deploy again'}
                </button> 
            ) : (
                <button className='deploy-button' onClick={deployContract} disabled={isDeploying}>
                    {isDeploying ? 'Deploying Contract...' : 'Deploy Contract'}
                </button>  
            )}
        </>
    );
};

export default Deploy;

