import React, { useEffect, useState } from 'react';
import prodToast from './../products/toastSuccess';
import { submitSupplier } from '../../utils/supplierUtils/supplierApi';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';

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

    if (!isOpen) return null;

    return createPortal(
        <>
            <div 
                className={`modal fade show`} 
                style={{ display: 'block' }} 
                tabIndex="-1" 
                role="dialog" 
                aria-hidden="false"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content p-3">
                        <div className="modal-header">
                            <h5 className="modal-title" id="supplierModalLabel">
                                {mode === 'edit' ? 'Edit Supplier' : 'Add Supplier Profile'}
                            </h5>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                {serverError && <div className="alert alert-danger">{serverError}</div>}
                                <div className="mb-3">
                                    <label htmlFor="supplierName" className="form-label">Supplier Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.supplierName ? 'is-invalid' : ''}`}
                                        id="supplierName"
                                        {...register("supplierName", { required: "Supplier name is required" })}
                                    />
                                    {errors.supplierName && <div className="invalid-feedback">{errors.supplierName.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="contactNo" className="form-label">Contact no</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.contactNo ? 'is-invalid' : ''}`}
                                        id="contactNo"
                                        {...register("contactNo", { required: "Contact number is required", min: 0 })}
                                    />
                                    {errors.contactNo && <div className="invalid-feedback">{errors.contactNo.message}</div>}
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-secondary me-2" onClick={onRequestClose}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {mode === 'edit' ? 'Update Supplier' : 'Create Supplier'}
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

export default SupplierModal;