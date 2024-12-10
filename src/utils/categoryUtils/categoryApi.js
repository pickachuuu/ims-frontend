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
        console.log(selectedCat);
        const token = Cookies.get('authToken');
        const res = await axios.delete('http://localhost:3000/api/categories/deleteAll/', { 
            data: {
                categoryIDs: selectedCat
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(res);

        if (res.status === 200){
            toast("categories successfully deleted");
        }
    } catch (error) {
        console.error('Error deleting categories:', error);
        toastWarn("failed to delete categories");
    }
};

export const submitCategory = async (formData, mode, category) => {
    const token = Cookies.get('authToken');
    const payload = {
        categoryName: formData.categoryName
    };

    let response;
    try {
        if (mode === 'edit') {
            response = await axios.put(`http://localhost:3000/api/categories/update/${category.categoryID}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                return { status: response.status, message: 'Category updated successfully.' };
            } else {
                throw new Error('Failed to update category.');
            }
        } else {
            response = await axios.post('http://localhost:3000/api/categories/create', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                return { status: response.status, message: 'Category created successfully.' };
            } else {
                throw new Error('Failed to create category.');
            }
        }
    } catch (error) {
        console.error("Error processing category:", error);
        if (error.response) {
            throw new Error(`Failed to process the request. ${error.response.data.message}`);
        } else {
            throw new Error('Failed to process the request.');
        }
    }
};