import React from 'react';
import LoginForm from '../components/auth/login';
import SideBanner from '../components/auth/sideBanner';

const LandingPage = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div 
                className="row border rounded-5 p-3 bg-white shadow mx-auto">
                <SideBanner />
                <LoginForm />
            </div>
        </div>
    );
};

export default LandingPage;