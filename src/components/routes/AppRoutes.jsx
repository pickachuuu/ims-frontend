import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LandingPage from '../../pages/landingPage';
import RegisterPage from '../../pages/registerPage';
import PrivateRoutes from './PrivateRoutes';
import DashboardPage from '../../pages/dashboardPage';

const AppRoutes =() => {
  const { token, isAuthenticated } = useContext(AuthContext);

  return (
      <Router>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/Dashboard" />} />
          <Route path='/register' element={< RegisterPage/>}/>
          <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={< DashboardPage />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default AppRoutes;
