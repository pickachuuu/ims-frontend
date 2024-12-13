import React from 'react';
import ProfileForm from '../components/profile/ProfileForm';
import { Typography } from '@mui/material';

const ProfilePage = () => {
    return (
        <div className="border rounded-3 p-4 bg-white shadow mx-auto" style={{ margin: '0 auto', height: '95vh', overflow: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h4">Profile</Typography>
            </div>
            <hr />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <ProfileForm />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;