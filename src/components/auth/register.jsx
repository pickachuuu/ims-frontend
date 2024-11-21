import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { registerSchema } from '../validations/registerSchema';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post('http://localhost:3000/api/users/register', data);
      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      // errors.root.message = error.response?.data?.message || 'Registration failed';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="col-md-6 c0l-sm-12 col-lg-5 right-box">
      <div className="row align-items-center p-4">
      <h2 className='mb-2 p-1'>Register</h2>
      <h5 className='mb-1 p-1'>Manage your inventory efficiently</h5>
        <div className="header-text mb-4 p-1">
          <p>Let's get started! Verify your personal account and set up your work profile.</p>
        </div>
        
        <div className='row'>
          <div className='col-6'>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control form-control-lg bg-light fs-6" 
              placeholder="First name"
              {...register("first_name", registerSchema.first_name)}/>
              {errors.first_name && <div className='text-red-500 mt-1'>{errors.first_name.message}</div>}
          </div>
          </div>
          <div className='col-6'>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control form-control-lg bg-light fs-6" 
              placeholder="Last name"
              {...register("last_name", registerSchema.last_name)}
            />
            {errors.last_name && <div className='text-red-500 mt-1'>{errors.last_name.message}</div>}
          </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control form-control-lg bg-light fs-6" 
              placeholder="Email address"
              {...register("email", registerSchema.email)}/>
              {errors.email && <div className='text-red-500 mt-1'>{errors.email.message}</div>}
          </div>
          </div>
          <div className='col-12'>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control form-control-lg bg-light fs-6" 
              placeholder="Password"
              {...register("password", registerSchema.password)}
            />
            {errors.password && <div className='text-red-500 mt-1'>{errors.password.message}</div>}
          </div>
          </div>
        </div>

        
        <div className="input-group mb-5 d-flex justify-content-between align-items-center">
          <div className="form-check d-flex align-items-center">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="formCheck"
            />
            <label 
              htmlFor="formCheck" 
              className="form-check-label text-secondary"
            >
              <small className="ms-2">I agree to all terms and conditions</small>
            </label>
          </div>
        </div>
        
        <div className="input-group mb-3">
          <button type="submit" className="btn btn-lg btn-primary w-100 fs-6">
            Sign up
          </button>
        </div>
        <div className="row">
          <div className="col-12">
            <small>
              Already have an account? <Link to ="/" className='custom-text'>Log in</Link>
            </small>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;