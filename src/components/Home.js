import React from "react";
import homeImage from "./img/home.png";
import styles from "../styles/Home.css";
import MetaMask from "../MetaMask.js"

function Home() {
    return (
        <div className="home">
            <div className="welcome">
                <h1>Welcome to <br />FairAid</h1>
            </div>
            <div className="home-Body">
                <div className="intro">
                    <h1 className="intro-sentence">Decentralized Refugee Identity<br />
                        Verification Service Using NFT</h1>
                    <MetaMask />
                </div>
                <img className="intro-img" src={homeImage} width="700px" height="400px" alt="" />
            </div>
        </div >
    );
}

export default Home;