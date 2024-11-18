import React from 'react';
import axios from 'axios';
import { loginSchema } from '../validations/loginSchema';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  return (
    <div className="col-md-5 right-box order-lg-1 order-sm-2">
      <div className="row align-items-center p-5">
        <div className="header-text mb-4">
          <h2>Login</h2>
          <p>Streamline your inventory, maximize your business</p>
        </div>
        
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control form-control-lg bg-light fs-6" 
            placeholder="Email address"
          />
        </div>
        
        <div className="input-group mb-1">
          <input 
            type="password" 
            className="form-control form-control-lg bg-light fs-6" 
            placeholder="Password"
          />
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
              <small className="ms-2">Remember Me</small>
            </label>
          </div>
          <div className="forgot d-flex align-items-center">
            <small>
              <a href="#">Forgot Password?</a>
            </small>
          </div>
        </div>
        
        <div className="input-group mb-3">
          <button className="btn btn-lg btn-primary w-100 fs-6">
            Login
          </button>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <small>
              Not registered yet? <a href="#">Create an account</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;