import React, { useState, useEffect } from "react";
import "../styles/Offices.css";

function Offices() {
    const [addresses, setAddresses] = useState([]);
    const [jsonFile, setJsonFile] = useState([]);

    useEffect(() => {
        const officesUrl = "https://lavender-peculiar-gamefowl-279.mypinata.cloud/ipfs/QmUZitxuGNRRLwerJJ6WeDcdBquxNcpmWhpD3BPiafcQMc";

        fetch(officesUrl)
            .then(response => response.json())
            .then(officesJson => {
                const addresses = Object.keys(officesJson);
                setJsonFile(officesJson);
                setAddresses(addresses);
            })
            .catch(error => console.error('Error fetching the JSON:', error));
    }, []);

    return (
        <div style={{ padding: "50px" }}>
            <h3>Check out all of the Immigration Offices that provide FairAid IDs.</h3>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Issuer Name</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Address</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>Contact</th>
                        <th style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }}>View on Etherscan</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map((key, index) => (
                        <tr>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }} key={index}>{jsonFile[key].Name}</td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }} key={index}>{key}</td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }} key={index}>
                                <p>Email: {jsonFile[key].Email}</p>
                                <p>Phone: {jsonFile[key].Phone}</p>
                                <p>Address: {jsonFile[key].Address}</p>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid black' }} key={index}>
                                <div style={{ marginTop: '4px', textAlign: 'center' }}>
                                    <a
                                        href={`https://sepolia.arbiscan.io/address/${key}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: 'white', backgroundColor: '#007bff', padding: '10px 20px', borderRadius: '5px' }}
                                    >
                                        View
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Offices;
