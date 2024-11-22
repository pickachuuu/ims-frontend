import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { loginSchema } from '../validations/loginSchema';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Login = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const {isAuthenticated, setIsAuthenticated, login} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', data);
      console.log(response);

      if (response.status === 200) {
        const token = response.data.token;
        document.cookie = `authToken=${token}`;
        setIsAuthenticated(true);
        login(response.data.user);
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        setError('email', {
          type: 'server',
          message: error.response.data.message
        });
      } else if (error.response?.status === 401) {
        setError('password', {
          type: 'server', 
          message: error.response.data.message
        });
      } else {
        setError('root', {
          type: 'server',
          message: error.response?.data?.message || 'Login failed'
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="col-md-5 col-lg-5 col-sm-12 right-box order-sm-1 order-md-1 order-2">
      <div className='mt-3 mx-3 d-flex justify-content-center align-items-center'>
        <img 
          src={logo} 
          alt="Company Logo" 
          className="img-fluid"
          style={{ maxWidth: '75px', height: 'auto' }}
        />
      </div>
      <div className="row align-items-center p-4">
        <h2 className='mb-1 p-1 text-center'>Login to your account</h2>
          <div className="my-3">
          <input 
            type="text" 
            className={`form-control form-control-lg bg-light fs-6 ${errors.email ? 'is-invalid border-danger' : ''}`}
            placeholder="Email address"
            {...register("email", loginSchema.email)}
          />
          {errors.email && <div className='text-danger mt-1 small'>{errors.email.message}</div>}
        </div>
        
        <div className="mb-1">
          <input 
            type="password" 
            className={`form-control form-control-lg bg-light fs-6 ${errors.password ? 'is-invalid border-danger' : ''}`}
            placeholder="Password"
            {...register("password", loginSchema.password)}
          />
          {errors.password && <div className='text-danger mt-1 small'>{errors.password.message}</div>}
        </div>
          
          <div className="mb-3 mt-2 d-flex justify-content-start">  {/* Changed class and removed input-group */}
            <div className="forgot">
              <small>
                <a href="#">Forgot Password?</a>
              </small>
            </div>
          </div>
          
          <div className="input-group mb-3 flex-column"> 
            <button type="submit" className="btn btn-lg btn-primary w-100 fs-6">
              Login
            </button>
            {errors.root && errors.root.message && (
              <div className="w-100 text-center mt-2">  
                <span className="text-danger">{errors.root.message}</span>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <small>
                Not registered yet? < Link to="/register" className='custom-text'>Create an account</Link>
              </small>
            </div>
          </div>
      </div>
    </form>
  );
};

export default Login;