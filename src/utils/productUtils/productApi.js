import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchProducts = async () => {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:3000/api/products/get', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.products;
};

export const fetchCategories = async () => {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:3000/api/categories/get', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.categories;
};

export const fetchSuppliers = async () => {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:3000/api/suppliers/get', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.suppliers;
};