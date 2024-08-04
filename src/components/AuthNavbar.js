import react from "react";
import "../App.css";
import "../styles/Navbar.css";
import MetaMask from "../MetaMask";
import { Outlet, Link } from "react-router-dom";


function AuthNavbar(props) {
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
                        <MetaMask />
                    </li>
                </ul>
            </nav>

            <Outlet />

        </div>
    );
}

export default AuthNavbar;