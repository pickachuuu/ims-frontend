import React from 'react';
import RegisterForm from '../components/auth/register';
import SideBanner from '../components/banners/sideBannerReg';
import BG from '../assets/curve.svg';
import '../App.css';

const RegisterPage = () => {
    return (
        <div className="page-container" style={{ backgroundImage: `url(${BG})` }}>  
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row border rounded-5 p-3 bg-white shadow mx-auto">
                        <SideBanner />
                        <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;