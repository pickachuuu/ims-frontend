import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BG from '../../assets/curve.svg';
import logo from '../../assets/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="page-container" style={{ backgroundImage: `url(${BG})` }}>
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row border rounded-5 p-3 bg-white shadow mx-auto">
                    <form onSubmit={handleSubmit} className="col-md-12 right-box">
                        <div className='mt-3 mx-3 d-flex justify-content-center align-items-center'>
                            <img 
                                src={logo} 
                                alt="Company Logo" 
                                className="img-fluid"
                                style={{ maxWidth: '75px', height: 'auto' }}
                            />
                        </div>
                        <div className="row align-items-center p-4">
                            <h2 className='mb-3 text-center'>Forgot Password</h2>
                            <p className="text-center text-muted mb-4">
                                Enter your email address and we'll send you a link to reset your password
                            </p>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="form-control form-control-lg bg-light fs-6"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <button type="submit" className="btn btn-lg btn-primary w-100 fs-6">
                                    Send Reset Link
                                </button>
                            </div>
                            {message && <div className="text-center mt-2"><small>{message}</small></div>}
                            <div className="row mt-3">
                                <div className="col-12 text-center">
                                    <small>
                                        Remember your password? <Link to="/" className='custom-text'>Login</Link>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
