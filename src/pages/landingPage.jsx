import React from 'react';
import LoginForm from '../components/auth/login';
import SideBanner from '../components/banners/sideBanner';
import BG from '../assets/curve.svg';
import logo from '../assets/logo.png';

const LandingPage = () => {
    return (
        <div className="page-container" style={{ backgroundImage: `url(${BG})` }}>
            <div className="container d-flex justify-content-center align-items-center min-vh-100" >
                <div 
                    className="row border rounded-5 p-3 bg-white shadow mx-auto">
                    <LoginForm />
                    <SideBanner />
                </div>
            </div>
        </div>

    );
};

export default LandingPage;