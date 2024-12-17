import React, { useEffect, useState } from 'react';
import prodToast from './toastSuccess';
import { submitProduct } from '../../utils/productUtils/productApi';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';

const CreateProductModal = ({ isOpen, onRequestClose, categories, suppliers, product, mode }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && product) {
            setValue('productName', product.productName);
            setValue('quantity', product.quantity);
            setValue('price', product.price);
            setValue('categoryID', product.categoryID || '');
            setValue('supplierID', product.supplierID || '');
        } else {
            setValue('productName', '');
            setValue('quantity', 0);
            setValue('price', 0);
            setValue('categoryID', '');
            setValue('supplierID', '');
        }
    }, [product, mode]);

    const onFormSubmit = async (data) => {
        try {
            const response = await submitProduct(data, mode, product);

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

    if (!isOpen) return null;

    return createPortal(
        <>
            <div 
                className={`modal fade show`} 
                style={{ display: 'block' }} 
                tabIndex="-1" 
                role="dialog" 
                aria-labelledby="createProductModalLabel" 
                aria-hidden="false"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="createProductModalLabel">
                                {mode === 'edit' ? 'Edit Product' : 'Create New Product'}
                            </h5>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                {serverError && <div className="alert alert-danger">{serverError}</div>}
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                                        id="productName"
                                        {...register("productName", { required: "Product name is required" })}
                                    />
                                    {errors.productName && <div className="invalid-feedback">{errors.productName.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                        id="quantity"
                                        {...register("quantity", { required: "Quantity is required", min: 0 })}
                                    />
                                    {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                        id="price"
                                        {...register("price", { required: "Price is required", min: 0 })}
                                    />
                                    {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="categoryID" className="form-label">Category (Optional)</label>
                                    <select
                                        className="form-select"
                                        id="categoryID"
                                        {...register("categoryID")}
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
                                        {...register("supplierID")}
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
            <div className="modal-backdrop fade show" />
        </>,
        document.body
    );
};

export default CreateProductModal;