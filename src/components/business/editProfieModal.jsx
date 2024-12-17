import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';

const EditProfileModal = ({ isOpen, onClose, onSave, profileData }) => {
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (profileData) {
            setValue('firstName', profileData.firstName);
            setValue('lastName', profileData.lastName);
            setValue('email', profileData.email);
            setValue('businessName', profileData.businessName);
            setValue('address', profileData.address);
            setValue('businessEmail', profileData.businessEmail);
        }
    }, [profileData, setValue]);

    const onFormSubmit = (data) => {
        onSave(data); 
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Profile</h5>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        {...register("firstName", { required: "First name is required" })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        {...register("lastName", { required: "Last name is required" })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        {...register("email", { required: "Email is required" })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="businessName" className="form-label">Business Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="businessName"
                                        {...register("businessName", { required: "Business name is required" })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Business Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        {...register("address", { required: "Business address is required" })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="businessEmail" className="form-label">Business Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="businessEmail"
                                        {...register("businessEmail", { required: "Business email is required" })}
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save
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

export default EditProfileModal;