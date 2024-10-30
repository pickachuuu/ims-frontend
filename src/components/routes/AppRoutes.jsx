import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LandingPage from '../../pages/HomePage';

const AppRoutes =() => {
  const { token, isAuthenticated } = useContext(AuthContext);

  console.log(`token = ${token}`)
  console.log(`isAuth = ${isAuthenticated}`)
  return (
      <Router>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/Dashboard" />} />
        </Routes>
      </Router>
  );
}

export default AppRoutes;
