import React from "react";
import Deploy from "./Deploy";
import Mint from "./Mint";
import ListOfIDs from "./IDlist";
import '../../App.css';
import '../../styles/UserPage.css';
import '../../styles/AdminPage.css'; // 새로운 CSS 파일 추가

const AdminPage = ({ signer }) => {
    return (
        <div className="admin-container">
            <h1>Manage IDs</h1>
            <div className="deploy-section">
                <Deploy signer={signer} />
            </div>
            <div className="mint-section">
                <Mint signer={signer} />
            </div>
            <div className="id-list-section">
                <ListOfIDs signer={signer} />
            </div>
        </div>
    );
};

export default AdminPage;
