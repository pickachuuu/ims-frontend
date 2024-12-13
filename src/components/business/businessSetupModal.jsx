import { React, useContext } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../assets/logo.png'; 
import axios from 'axios';
import Cookies from 'js-cookie';
import { businessSetupSchema } from '../validations/businessSetupSchema';
import { AuthContext } from '../../context/AuthContext';

const BusinessSetupModal = ({ isOpen, onRequestClose }) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { business, updateBusiness } = useContext(AuthContext);

    const onFormSubmit = async (data) => {
        try {
            const token = Cookies.get('authToken'); 
            const response = await axios.post('http://localhost:3000/api/business/setup', data, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            console.log(data);
            if (!response.data) {
                console.log(response);
                setError('root', { type: 'server', message: 'Failed to set up business.' });
            }

            if (response.status === 201) {
                const newToken = response.data.token;
                Cookies.set('authToken', newToken);
                updateBusiness(data.businessName);
                onRequestClose(); 
            }

        } catch (error) {
            setError('root', { type: 'server', message: 'Failed to set up business.' });
        }
    };

    return (
        <>
            <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="businessSetupModalLabel" aria-hidden={!isOpen}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content p-3">
                        <div className="modal-header text-center">
                            <div className='mt-3 mx-auto'>
                                <img 
                                    src={logo} 
                                    alt="Company Logo" 
                                    className="img-fluid"
                                    style={{ maxWidth: '75px', height: 'auto' }}
                                />
                                <h5 className="modal-title mt-2" id="businessSetupModalLabel">Setup Your Business Profile</h5>
                            </div>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                <div className="mb-3">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.businessName ? 'is-invalid' : ''}`} 
                                        placeholder="Business Name" 
                                        {...register("businessName", businessSetupSchema.businessName)} 
                                    />
                                    {errors.businessName && <div className='text-danger mt-1'>{errors.businessName.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.businessAddress ? 'is-invalid' : ''}`} 
                                        placeholder="Business Address" 
                                        {...register("address", businessSetupSchema.businessAddress)} 
                                    />
                                    {errors.businessAddress && <div className='text-danger mt-1'>{errors.businessAddress.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="tel" 
                                        className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`} 
                                        placeholder="Contact Number" 
                                        {...register("contactNumber", businessSetupSchema.contactNumber)} 
                                    />
                                    {errors.contactNumber && <div className='text-danger mt-1'>{errors.contactNumber.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="email" 
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                        placeholder="Business Email" 
                                        {...register("businessEmail", businessSetupSchema.email)} 
                                    />
                                    {errors.email && <div className='text-danger mt-1'>{errors.email.message}</div>}
                                </div>
                                {errors.root && <div className='text-danger mt-2'>{errors.root.message}</div>}
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default BusinessSetupModal;