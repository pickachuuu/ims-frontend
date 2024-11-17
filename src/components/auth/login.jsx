import React from 'react';
import axios from 'axios';
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
      password: '',
      rememberMe: false
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
    <div className='container-fluid p-1 mb-5'>
      <div className='row'>
        <div className="col-12 p-1">
        <div>
          <span className='lead'>Login</span>
        </div>
        <div>
          <span className='d-none d-md-block my-3'>Streamline your inventory, maximize your business</span>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className='needs-validation mt-4'>
          <div className='mb-3'>
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

          <div className='mb-3'>
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

          <div className="row mb-3">
            <div className="col-12">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  {...register('rememberMe')}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
            </div>
            <div className="col-6 text-end">
              <a href="#" cl  assName="text-decoration-none text-muted">
                Forgot password?
              </a>
            </div>
          </div>

          <div className='mb-5'>
            <button 
              className='btn btn-dark btn-lg w-100 my-3 rounded-pill' 
              type='submit'
            >
              Login
            </button>
            
            {errors.root && (
              <div className='text-danger text-center mb-3'>
                {errors.root.message}
              </div>
            )}
              <span className='my-3'>Not registered yet? </span>
              <a 
                className='text-decoration-none' 
                href='#' 
                onClick={toggleComponent}
              >
                Create a new account
              </a>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Login;