import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import prodToast from '../products/toastSuccess';
import { submitCategory } from '../../utils/categoryUtils/categoryApi';

const CategoryModal = ({ isOpen, onRequestClose, mode, category }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && category) {
            setValue('categoryName', category.categoryName);
        } else {
            setValue('categoryName', '');
        }
    }, [category, mode, setValue]);

    const onFormSubmit = async (data) => {
        try {
            const response = await submitCategory(data, mode, category);

            if (response.status === 201 || response.status === 200) {
                prodToast(mode === 'edit' ? 'Category updated successfully!' : 'Category created successfully!');
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
                aria-labelledby="categoryModalLabel" 
                aria-hidden="false"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content p-3">
                        <div className="modal-header">
                            <h5 className="modal-title" id="categoryModalLabel">
                                {mode === 'edit' ? 'Edit Category' : 'Create New Category'}
                            </h5>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                {serverError && <div className="alert alert-danger">{serverError}</div>}
                                <div className="mb-3">
                                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.categoryName ? 'is-invalid' : ''}`}
                                        id="categoryName"
                                        {...register("categoryName", { required: "Category name is required" })}
                                    />
                                    {errors.categoryName && <div className="invalid-feedback">{errors.categoryName.message}</div>}
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-secondary me-2" onClick={onRequestClose}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {mode === 'edit' ? 'Update Category' : 'Create Category'}
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

export default CategoryModal;