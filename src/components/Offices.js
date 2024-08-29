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
        <div className="container">
            <h2 className="header">
                Check out all of the Immigration Offices that provide FairAid IDs.
            </h2>

            <table className="table">
                <thead>
                    <tr>
                        <th>Issuer Name</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>View on Etherscan</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map((key, index) => (
                        <tr key={index}>
                            <td style={{ fontSize: '30px' }}>
                                {(() => {
                                    const parts = jsonFile[key].Name.split(' ');
                                    return (
                                        <>
                                            {parts[0]}
                                            <br />
                                            {parts.slice(1).join(' ')}
                                        </>
                                    );
                                })()}
                            </td>

                            <td>
                                {key}
                            </td>
                            <td>
                                <p>Email: {jsonFile[key].Email}</p>
                                <p>Phone: {jsonFile[key].Phone}</p>
                                <p>Address: {jsonFile[key].Address}</p>
                            </td>
                            <td>
                                <div className="view-button-container">
                                    <a
                                        href={`https://sepolia.arbiscan.io/address/${key}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-button"
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
