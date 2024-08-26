import React from "react";
import "../../App.css";
import "../../styles/Navbar.css";
import MetaMask from "../../MetaMask";
import { Outlet, Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; // react-scroll의 Link를 import

function Navbar(props) {
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
                        {/* Link 컴포넌트 대신 ScrollLink로 변경하여 특정 섹션으로 이동 */}
                        <ScrollLink to="about-section" smooth={true} duration={500}>
                            About Us
                        </ScrollLink>
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
