import React from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { loginSchema } from '../validations/loginSchema';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';



const Login = ({ toggleComponent }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    reset 
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', data);
      
      if (response.status === 200) {
        reset();
        document.cookie = `authToken=${response.data.token}`;
        useNavigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.status === 401
        ? "Invalid email or password"
        : "Login failed. Please try again later";

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
          <span className='lead'>Welcome Back</span>
        </div>
        <div>
          <h1 className='d-none d-md-block'>Login to your account</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className='needs-validation mt-4'>
          <div className='mb-2'>
            <label className='form-label'>Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', loginSchema.email)}
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
              {...register('password', loginSchema.password)}
            />
            {errors.password && (
              <div className='text-danger small'>{errors.password.message}</div>
            )}
          </div>

          <div>
            <button 
              className='btn btn-dark btn-lg my-3 btn-block rounded-pill' 
              type='submit'
            >
              Login
            </button>
            
            {errors.root && (
              <div className='text-danger text-center mb-3'>
                {errors.root.message}
              </div>
            )}

            <hr/>

            <div className='text-center'>
              <span>Don't have an account? </span>
              <a 
                className='text-custom' 
                href='#' 
                onClick={toggleComponent}
              >
                Register
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;