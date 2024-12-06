import axios from 'axios';
import Cookies from 'js-cookie';
import toast from '../../components/products/toastSuccess'
import toastWarn from '../../components/products/toastWarning'

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

export const handleDelete = async (prodID) => {
    try {
        const token = Cookies.get('authToken');
        const res = await axios.delete(`http://localhost:3000/api/products/delete/${prodID}`, {
            headers:{
                Authorization: `bearer ${token},`
            },
        });
    }catch (error) {
        toastWarn("failed to delete product");
    }
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
            toast("products sucessfully deleted");
        }
    } catch (error) {
        console.error('Error deleting items:', error);
    }
};

export const submitProduct = async (formData, mode, product) => {
    const token = Cookies.get('authToken');
    const payload = {
        productName: formData.productName,
        quantity: formData.quantity,
        price: formData.price,
        categoryID: formData.categoryID || null,
        supplierID: formData.supplierID || null,
    };

    let response;
    try {
        if (mode === 'edit') {
            response = await axios.put(`http://localhost:3000/api/products/update/${product.productID}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            response = await axios.post('http://localhost:3000/api/products/create', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return response; // Return the response for further handling
    } catch (error) {
        console.error("Error processing product:", error);
        throw new Error('Failed to process the request.'); // Throw an error to be caught in the calling function
    }
};