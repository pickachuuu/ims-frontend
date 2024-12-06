import { submitCategory } from "../../utils/categoryUtils/categoryApi";
import React, { useEffect, useState } from 'react';
import prodToast from '../products/toastSuccess';
import { useForm } from 'react-hook-form';

const CategoryModal = ({isOpen, onRequestClose, mode, category}) => { 
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && category) {
            setValue('categoryName', category.categoryName); 
            setValue('description', category.description); 
        } else {
            setValue('categoryName', ''); 
            setValue('description', ''); 
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

    return (
        <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{mode === 'edit' ? 'Edit Category' : 'Create New Category'}</h5>
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
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    id="description"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
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
    );  
}

export default CategoryModal;