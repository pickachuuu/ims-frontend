import { Typography, Skeleton, Button } from '@mui/material'; // Import necessary components
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { fetchUserProfile } from '../utils/userUtils/userApi';
import EditProfileModal from '../components/business/editProfieModal'; // Import the new modal component
import Cookies from 'js-cookie';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        ID: '',
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
        address: '',
        businessEmail: '',
    });
    const [open, setOpen] = useState(false); // State for modal open/close

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchUserProfile();
                if (response) {
                    setProfileData({
                        ID: response.user.userID || '',
                        firstName: response.user.firstName || '',
                        lastName: response.user.lastName || '',
                        email: response.user.email || '',
                        businessName: response.user.business.businessName || '',
                        address: response.user.business.address || '',
                        businessEmail: response.user.business.businessEmail || '',
                    });
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
                setError(error.response?.data?.message || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async (data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                console.error('No auth token found');
                return null; 
            }
            const response = await fetch('http://localhost:3000/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)  // Changed from 'data' to 'body: JSON.stringify(data)'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
    
            const result = await response.json();
            console.log(result.message); // Handle success message
            setProfileData(data); // Update the profile data with the new values
            handleClose(); // Close the modal after saving
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error (e.g., show a notification)
        }
    };

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh', overflow: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Profile</Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>Edit</Button> {/* Edit Button */}
            </div>
            <hr />
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <img 
                            src={logo} 
                            alt="Company Logo" 
                            className="img-fluid mb-3"
                            style={{ maxWidth: '75px', height: 'auto' }}
                        />
                        <h4 className="mb-1">{profileData.firstName} {profileData.lastName}</h4>
                        <p className="text-muted">{profileData.businessName}</p>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label text-muted">First Name</label>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={40} />
                                ) : (
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        value={profileData.firstName}
                                        disabled 
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label text-muted">Last Name</label>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={40} />
                                ) : (
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        value={profileData.lastName}
                                        disabled 
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label text-muted">Email</label>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={40} />
                                ) : (
                                    <input 
                                        type="email" 
                                        className="form-control bg-light" 
                                        value={profileData.email} 
                                        disabled 
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label text-muted">Business Name</label>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={40} />
                                ) : (
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        value={profileData.businessName} 
                                        disabled 
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label className="form-label text-muted">Business Address</label>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={40} />
                                ) : (
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        value={profileData.address} 
                                        disabled 
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label className="form-label text-muted">Business Email</label>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={40} />
                                ) : (
                                    <input 
                                        type="email" 
                                        className="form-control bg-light" 
                                        value={profileData.businessEmail} 
                                        disabled 
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Use the EditProfileModal component */}
            <EditProfileModal 
                isOpen={open} 
                onClose={handleClose} 
                onSave={handleSave} // Pass the handleSave function
                profileData={profileData} 
            />
        </div>
    );
};

export default ProfilePage;