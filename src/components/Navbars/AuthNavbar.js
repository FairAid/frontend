import react from "react";
import "../../App.css";
import "../../styles/Navbar.css";
import MetaMask from "../../MetaMask";
import { Outlet, Link } from "react-router-dom";


function AuthNavbar(props) {
    return (
        <div className="nav">
            <nav>
                <ul>
                    <li>
                        <img className="logo-img" src="https://gateway.pinata.cloud/ipfs/QmQyXKEngRuTBjELPZ9eFsnpfyjR43u5t3sy7DWWUhoxVh" alt="Logo" />
                    </li>
                    <li className="Name">
                        RefuPass
                    </li>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
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

export default AuthNavbar;