import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LandingPage from '../../pages/landingPage';
import RegisterPage from '../../pages/registerPage';
import PrivateRoutes from './PrivateRoutes';
import HomePage from '../../pages/homePage';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/Home" />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/Home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
