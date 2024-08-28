import React, { useState, useEffect } from 'react';
import '../styles/Home.css'; // CSS 파일 임포트

// 슬라이드 이미지 불러오기
import slide1 from './img/slide1.jpg';
import slide2 from './img/slide2.jpg';
import slide3 from './img/slide3.jpg';
import slide4 from './img/slide4.jpg';
import slide5 from './img/slide5.jpg';

// 기능 이미지 불러오기
import feature1Image from './img/feature1.png';
import feature2Image from './img/feature2.png';
import feature3Image from './img/feature3.png';

import MetaMask from "../MetaMask.js"; // MetaMask 컴포넌트 임포트

function Home() {
    // 슬라이드 이미지를 배열로 관리
    const images = [slide1, slide2, slide3, slide4, slide5];

    // 현재 슬라이드 인덱스를 상태로 관리
    const [currentSlide, setCurrentSlide] = useState(0);

    // useEffect를 사용해 3초마다 슬라이드 전환
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 3000); // 3초마다 슬라이드 전환

        return () => clearInterval(slideInterval); // 컴포넌트 언마운트 시 인터벌 클리어
    }, [images.length]);

    return (
        <div className="home">
            <div className="welcome">
                <h1>Welcome to RefuPass</h1>
            </div>
            <div className="home-Body">
                <div className="intro">
                    <h1 className="intro-sentence">Decentralized<br /> Refugee Identity<br />
                        Verification Service <br />Using NFT</h1>
                    <MetaMask />
                </div>
                <img src={images[currentSlide]} alt="Slide" className="slide-image" />
            </div>
            <section id="about" className="about-section">
                <h2>About Our Platform</h2>
                <p>
                    Our platform leverages the power of NFTs to provide refugees with secure and verifiable identity cards. By issuing these identity cards as non-fungible tokens on the blockchain, we ensure that each identity is unique, encrypted, and traceable, making it impossible for unauthorized parties to access or alter sensitive personal information.
                </p>
            </section>

            <section id="features" className="features-section">
                <h2>Key Features</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Easy NFT Identity Issuance</h3>
                        <img src={feature1Image} alt="Feature 1" className="feature-img" />
                        <p>Our platform enables refugees to easily obtain NFT-based identity cards, providing a secure and decentralized method for identity verification.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Secure Data Encryption</h3>
                        <img src={feature2Image} alt="Feature 2" className="feature-img" />
                        <p>All personal information is encrypted and stored using IPFS, ensuring that data is secure, tamper-proof, and decentralized.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Decentralized Identity Management</h3>
                        <img src={feature3Image} alt="Feature 3" className="feature-img" />
                        <p>By leveraging blockchain technology, we transform encrypted personal data into NFTs, ensuring that identities are uniquely verifiable and protected against unauthorized access.</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2024 Refugee NFT Identity Card Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
