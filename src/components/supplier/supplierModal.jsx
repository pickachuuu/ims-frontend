import React, { useEffect, useState } from 'react';
import prodToast from './../products/toastSuccess';
import { submitSupplier } from '../../utils/supplierUtils/supplierApi';
import { useForm } from 'react-hook-form';

const SupplierModal = ({ isOpen, onRequestClose, supplier, mode }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [serverError, setServerError] = useState('');
    
    useEffect(() => {
        if (mode === 'edit' && supplier) {
            setValue('supplierName', supplier.supplierName);
            setValue('contactNo', supplier.contactNo);
        } else {
            setValue('supplierName', '');
            setValue('contactNo', '');
        }
    }, [supplier, mode]);

    const onFormSubmit = async (data) => {
        try {
            const response = await submitSupplier(data, mode, supplier);

            if (response.status === 201 || response.status === 200) {
                prodToast(mode === 'edit' ? 'Supplier updated successfully!' : 'Supplier added successfully!');
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
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            {serverError && <div className="alert alert-danger">{serverError}</div>}
                            <div className="mb-3">
                                <label htmlFor="supplierName" className="form-label">Supplier Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                                    id="productName"
                                    {...register("supplierName", { required: "Product name is required" })}
                                />
                                {errors.productName && <div className="invalid-feedback">{errors.productName.message}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="contactNo" className="form-label">Contact no</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                    id="quantity"
                                    {...register("contactNo", { required: "Quantity is required", min: 0 })}
                                />
                                {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
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

export default SupplierModal;