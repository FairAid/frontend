import React, { useState } from 'react';
import { ethers } from "ethers";
import process from 'process';  


const Deploy = ({signer, user}) => {
    const storageContractAddress = `0x${process.env.REACT_STORAGE_CONTRACT}`;
    const [deployedContractAddress, setDeployedContractAddress] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);

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

            setDeployedContractAddress(contract.target);
            setIsDeploying(false);

            const storageArtifactURL = "https://gateway.pinata.cloud/ipfs/QmUXNEUQzL7B5UWYjN4rpHoWQq1CmCoKkDpzoCasasRqu6"
            const storageArtifact = await fetch(storageArtifactURL).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
            const { storageAbi } = storageArtifact;
            const storageContract = new ethers.Contract(storageContractAddress, storageAbi, signer);
            const storeDeployedContract = await storageContract.setDeployedContract(user, contract.target);
            await storeDeployedContract.wait();

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

