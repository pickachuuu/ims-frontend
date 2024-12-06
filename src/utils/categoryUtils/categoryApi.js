import axios from 'axios';
import Cookies from 'js-cookie';
import toast from '../../components/products/toastSuccess'
import toastWarn from '../../components/products/toastWarning'

export const fetchCategories = async () => {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:3000/api/categories/get', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.categories;
};


export const handleDelete = async (catID) => {
    try {
        const token = Cookies.get('authToken');
        const res = await axios.delete(`http://localhost:3000/api/category/delete/${catID}`, {
            headers:{
                Authorization: `bearer ${token},`
            },
        });

        if (res.status == 200){
            toast("sucessfully deleted category");
        }
    }catch (error) {
        toastWarn("failed to delete category");
    }
};

export const handleDeleteSelected = async (selectedCat) => {
    try {
    } catch (error) {
    }
};

export const submitCategory = async (formData, mode, product) => {
    const token = Cookies.get('authToken');
    console.log(formData);
    const payload = {
        categoryName: formData.categoryNameName,
    };


    let response;
    try {
        if (mode === 'edit') {
            response = await axios.put(`http://localhost:3000/api/category/update/${product.productID}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            response = await axios.post('http://localhost:3000/api/category/create', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

    return response; 
    } catch (error) {
        console.error("Error processing product:", error);
        throw new Error('Failed to process the request.'); 
    }
};