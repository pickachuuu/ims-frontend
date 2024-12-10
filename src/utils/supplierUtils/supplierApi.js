import axios from 'axios';
import Cookies from 'js-cookie';
import toast from '../../components/products/toastSuccess'
import toastWarn from '../../components/products/toastWarning'

export const fetchSuppliers = async () => {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:3000/api/suppliers/get', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.suppliers;
};

export const handleDelete = async (suppID) => {
    try {
        const token = Cookies.get('authToken');
        const res = await axios.delete(`http://localhost:3000/api/suppliers/delete/${suppID}`, {
            headers:{
                Authorization: `bearer ${token},`
            },
        });

        if (res.status == 200){
            toast("sucessfully deleted supplier");
        }
    }catch (error) {
        toastWarn("failed to delete supplier");
    }
};

export const submitProduct = async (formData, mode, supplier) => {
    const token = Cookies.get('authToken');
    const payload = {
        supplierName: formData.supplierName,
        contactNo: formData.contactNo,
        categoryID: formData.categoryID || null,
        supplierID: formData.supplierID || null,
    };

    let response;
    try {
        if (mode === 'edit') {
            response = await axios.put(`http://localhost:3000/api/suppliers/update/${supplier.supplierID}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            response = await axios.post('http://localhost:3000/api/suppliers/create', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

    return response; 
    } catch (error) {
        console.error("Error Creating Supplier Profile:", error);
        throw new Error('Failed to process the request.'); 
    }
};