import axios from 'axios';
import Cookies from 'js-cookie';
import toast from '../../components/products/toastSuccess'
import toastWarn from '../../components/products/toastWarning'


export const fetchUserProfile = async () => {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            console.error('No auth token found');
            return null; // Early return if no token
        }
        const response = await axios.get('http://localhost:3000/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Check response status
        console.log(response);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error fetching user profile: Unexpected response status', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error.message || error);
        return null;
    }
};

export const fetchBusinessProfile = async () => {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            console.error('No auth token found');
            return null; // Early return if no token
        }
        const response = await axios.get('http://localhost:3000/api/business/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Check response status
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error fetching business profile: Unexpected response status', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching business profile:', error.message || error);
        return null;
    }
};