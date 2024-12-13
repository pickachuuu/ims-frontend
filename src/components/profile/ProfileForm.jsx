import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import logo from '../../assets/logo.png';
import { CircularProgress } from '@mui/material';

const ProfileForm = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        businessName: '',
        address: '',
        businessEmail: '',
        phone: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get('authToken');
                const response = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const userData = response.data.user;
                const businessData = userData.business || {};

                setProfileData({
                    name: userData.name || '',
                    email: userData.email || '',
                    businessName: businessData.businessName || '',
                    address: businessData.address || '',
                    businessEmail: businessData.businessEmail || '',
                    phone: businessData.phone || ''
                });
            } catch (error) {
                console.error('Profile fetch error:', error);
                setError(error.response?.data?.message || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-5">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="text-center mb-4">
                    <img 
                        src={logo} 
                        alt="Company Logo" 
                        className="img-fluid mb-3"
                        style={{ maxWidth: '75px', height: 'auto' }}
                    />
                    <h4 className="mb-1">{profileData.name}</h4>
                    <p className="text-muted">{profileData.businessName}</p>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label text-muted">Full Name</label>
                            <input 
                                type="text" 
                                className="form-control bg-light" 
                                value={profileData.name} 
                                disabled 
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label text-muted">Email</label>
                            <input 
                                type="email" 
                                className="form-control bg-light" 
                                value={profileData.email} 
                                disabled 
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label text-muted">Business Name</label>
                            <input 
                                type="text" 
                                className="form-control bg-light" 
                                value={profileData.businessName} 
                                disabled 
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label text-muted">Contact Number</label>
                            <input 
                                type="text" 
                                className="form-control bg-light" 
                                value={profileData.phone} 
                                disabled 
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-group">
                            <label className="form-label text-muted">Business Address</label>
                            <input 
                                type="text" 
                                className="form-control bg-light" 
                                value={profileData.address} 
                                disabled 
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-group">
                            <label className="form-label text-muted">Business Email</label>
                            <input 
                                type="email" 
                                className="form-control bg-light" 
                                value={profileData.businessEmail} 
                                disabled 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
