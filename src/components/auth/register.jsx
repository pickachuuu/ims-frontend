import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { registerSchema } from '../validations/registerSchema';


const Register = ({ toggleComponent, setActiveComponent }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    watch,
    reset 
  } = useForm({
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      // Destructure and rename fields to match backend expectations
      const { confirmPassword, firstName, lastName, ...rest } = data;
      const submitData = {
        first_name: firstName,
        last_name: lastName,
        ...rest
      };

      const response = await axios.post('http://localhost:3000/api/users/register', submitData);
      
      if (response.status === 201) {
        reset(); // Clear form
        // setActiveComponent('login');
      }
    } catch (error) {
      const errorMessage = error.response?.status === 409
        ? "Account with this email already exists"
        : "Registration failed. Please try again later";

      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    }
  };

  return (
    <div className='container-fluid fixed-width-container my-custom mb-5'>
      <div className="col-lg-9 p-4 mx-auto shadow rounded">
        <div>
          <span className='lead'>Get Started</span>
        </div>
        <div>
          <h1 className='d-none d-md-block'>Create your account</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className='needs-validation mt-4'>
          <div className='row'>
            <div className='col-6'>
              <div className='mb-2'>
                <label className='form-label'>First name</label>
                <input
                  type="text"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  {...register('firstName', registerSchema.firstName)}
                />
                {errors.firstName && (
                  <div className='text-danger small'>{errors.firstName.message}</div>
                )}
              </div>
            </div>
            <div className='col-6'>
              <div className='mb-2'>
                <label className='form-label'>Last name</label>
                <input
                  type="text"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  {...register('lastName', registerSchema.lastName)}
                />
                {errors.lastName && (
                  <div className='text-danger small'>{errors.lastName.message}</div>
                )}
              </div>
            </div>
          </div>

          <div className='mb-2'>
            <label className='form-label'>Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', registerSchema.email)}
            />
            {errors.email && (
              <div className='text-danger small'>{errors.email.message}</div>
            )}
          </div>

          <div className='mb-2'>
            <label className='form-label'>Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', registerSchema.password)}
            />
            {errors.password && (
              <div className='text-danger small'>{errors.password.message}</div>
            )}
          </div>

          <div className='mb-2'>
            <label className='form-label'>Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...register('confirmPassword', {
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <div className='text-danger small'>{errors.confirmPassword.message}</div>
            )}
          </div>

          <div>
            <button 
              className='btn btn-dark btn-lg my-3 btn-block rounded-pill' 
              type='submit'
            >
              Create Account
            </button>
            
            {errors.root && (
              <div className='text-danger text-center mb-3'>
                {errors.root.message}
              </div>
            )}

            <hr/>

            <div className='text-center'>
              <span>Already have an account? </span>
              <a 
                className='text-custom' 
                href='#' 
                onClick={toggleComponent}
              >
                Login
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;