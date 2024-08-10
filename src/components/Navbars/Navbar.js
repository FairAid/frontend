import react from "react";
import "../../App.css";
import "../../styles/Navbar.css";
import MetaMask from "../../MetaMask";
import { Outlet, Link } from "react-router-dom";


function Navbar(props) {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <img className="logo-img" src="https://gateway.pinata.cloud/ipfs/QmQyXKEngRuTBjELPZ9eFsnpfyjR43u5t3sy7DWWUhoxVh" alt="Logo" />
                    </li>
                    <li className="Name">
                        FairAid
                    </li>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About FairAid</Link>
                    </li>
                    <li>
                        <Link to="/offices">Immigration Offices</Link>
                    </li>
                    <li>
                        <Link to="/verifyID">Verify ID</Link>
                    </li>
                    <li className="connect-wallet-btn">
                        <MetaMask />
                    </li>
                </ul>
            </nav>

            <Outlet />

        </div>
    );
}

export default Navbar;