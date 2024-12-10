import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BG from '../../assets/curve.svg';
import logo from '../../assets/logo.png';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/reset-password', { token, newPassword });
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
                            <h2 className='mb-3 text-center'>Reset Password</h2>
                            <p className="text-center text-muted mb-4">
                                Enter your new password
                            </p>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="form-control form-control-lg bg-light fs-6"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <button type="submit" className="btn btn-lg btn-primary w-100 fs-6">
                                    Reset Password
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

export default ResetPassword;
