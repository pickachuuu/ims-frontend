import React, { useState, useEffect } from 'react';
import prodToast from './toastSuccess';
import { submitProduct } from '../../utils/productUtils/productApi';

const CreateProductModal = ({ isOpen, onRequestClose, categories, suppliers, product, mode }) => {
    const [formData, setFormData] = useState({
        productName: '',
        quantity: 0,
        price: 0,
        categoryID: '',
        supplierID: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && product) {
            setFormData({
                productName: product.productName,
                quantity: product.quantity,
                price: product.price,
                categoryID: product.categoryID || '',
                supplierID: product.supplierID || ''
            });
        } else {
            setFormData({
                productName: '',
                quantity: 0,
                price: 0,
                categoryID: '',
                supplierID: ''
            });
        }
    }, [product, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.productName) newErrors.productName = 'Product name is required';
        if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
        if (formData.price < 0) newErrors.price = 'Price cannot be negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await submitProduct(formData, mode, product);

            if (response.status === 201 || response.status === 200) {
                prodToast(mode === 'edit' ? 'Product updated successfully!' : 'Product added successfully!');
                onRequestClose();
            } else {
                setServerError('Failed to process the request.');
            }
        } catch (error) {
            setServerError(error.message); 
        }
    };

    return (
        <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{mode === 'edit' ? 'Edit Product' : 'Create New Product'}</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onFormSubmit}>
                            {serverError && <div className="alert alert-danger">{serverError}</div>}
                            <div className="mb-3">
                                <label htmlFor="productName" className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                                {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryID" className="form-label">Category (Optional)</label>
                                <select
                                    className="form-select"
                                    id="categoryID"
                                    name="categoryID"
                                    value={formData.categoryID}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryID} value={category.categoryID}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="supplierID" className="form-label">Supplier (Optional)</label>
                                <select
                                    className="form-select"
                                    id="supplierID"
                                    name="supplierID"
                                    value={formData.supplierID}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.supplierID} value={supplier.supplierID}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={onRequestClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {mode === 'edit' ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );  
};

export default CreateProductModal;