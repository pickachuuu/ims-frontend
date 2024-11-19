import React from 'react';
import RegisterForm from '../components/auth/register';
import SideBanner from '../components/auth/sideBannerReg';
import '../App.css';

const RegisterPage = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div 
                className="row border rounded-5 p-3 bg-white shadow mx-auto">
                    <RegisterForm />
                    <SideBanner />
            </div>
        </div>
    );
};

export default RegisterPage;