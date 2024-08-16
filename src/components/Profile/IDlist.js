import React, { useState, useEffect, useRef } from 'react';
import { ethers } from "ethers";
import { create } from 'ipfs-http-client';

const ListOfIDs = ({ signer }) => {
    const contractAddress = "0xd94464119aDe5Ce776E1B426319b5ce865E9E00e";
    const [addressesList, setAddressesList] = useState([]);
    const [tokenIdList, setTokenIdList] = useState({});
    const [contractInst, setContractInst] = useState();
    const [showModal, setShowModal] = useState(false);
    const [updateError, setUpdateError] = useState('');

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

    const editID = async({
        tokenID,
        image,
        name,
        birthplace,
        issued_country,
        issued_authority,
        birth_date,
        passport_number,
        sex,
        address,
        issue_date,
        expiry_date
    }) => {
        if (!tokenIdList || !contractInst) {
            // Is there a way to make the program wait until addressesList is loaded???
            alert("Fetching info from blockchain...");
            // Do I even need this return command???
            return;
        }

        try {
            const updated_json = {
                "name": "FairAid DID",
                "image": image,
                "attributes": {
                  "Name": name,
                  "Place of birth": birthplace,
                  "Issued country": issued_country,
                  "Issued authority": issued_authority,
                  "Date of birth": birth_date,
                  "Passport number": passport_number,
                  "Sex": sex,
                  "Registration address": address,
                  "Date of issue": issue_date,
                  "Date of expiry": expiry_date
                }
            }

            const ipfs = create('https://ipfs.infura.io:5001/api/v0');

            const jsonBuffer = Buffer.from(JSON.stringify(updated_json));
            const result = await ipfs.add(jsonBuffer);

            const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
            const updateURI = await contractInst.updateTokenURI(tokenID, uri);
            await updateURI.wait();
            setShowModal(false);
            alert(`ID number ${tokenID} updated successfully!`);
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

        const handleEditID = () => {
            setShowModal(true);
        };
        
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
                                <button onClick={handleEditID}>Edit ID</button>
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

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Image</h2>
                            <input 
                                type="text" 
                                value={image} 
                                onChange={(e) => setSeedPhrase(e.target.value)} 
                            />
                        <button onClick={editID(image)}>Submit</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListOfIDs;
