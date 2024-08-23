import React from "react";
import styles from "../styles/About.css"

function Profile() {
    return (
        <div className="about-us">
            <div className="about-us-header">
                <h1>About Us</h1>
                <p>Learn more about our mission, vision, and the team that makes it all happen.</p>
            </div>
            <div className="about-us-content">
                <div className="about-us-section">
                    <h2>Our Mission</h2>
                    <p>
                        Our mission is to empower individuals and communities through innovative solutions
                        that drive positive change and improve quality of life.
                    </p>
                </div>
                <div className="about-us-section">
                    <h2>Our Vision</h2>
                    <p>
                        We envision a world where technology and creativity come together to solve
                        the most pressing challenges, creating opportunities for everyone.
                    </p>
                </div>
                <div className="about-us-section">
                    <h2>Our Team</h2>
                    <p>
                        Our team is composed of passionate professionals from diverse backgrounds, each bringing
                        unique skills and perspectives to the table. Together, we strive to achieve excellence in everything we do.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;