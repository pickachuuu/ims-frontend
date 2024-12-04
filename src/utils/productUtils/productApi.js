import axios from 'axios';
import Cookies from 'js-cookie';
import toast from '../../components/products/toastSuccess'

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

export const handleDeleteSelected = async (selectedItems) => {
    try {
        const token = Cookies.get('authToken');
        const res = await axios.delete('http://localhost:3000/api/products/deleteAll/', { 
            data: {
                productIDs: selectedItems
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        
        if (res.status == 200){
            toast("product sucessfully deleted");
        }
    } catch (error) {
        console.error('Error deleting items:', error);
    }
};