import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LandingPage from '../../pages/landingPage';
import RegisterPage from '../../pages/registerPage';
import PrivateRoutes from './PrivateRoutes';
import HomePage from '../../pages/homePage';
import Dashboard from '../../pages/dashboard';
import ProductPage from '../../pages/product';
import CategoriesPage from '../../pages/categories';
import LowStockPage from '../../pages/lowstock';
import SuppliersPage from '../../pages/supplier';
import ReportsPage from '../../pages/reports';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext); // Access loading state

  // Show loading message while loading
  if (loading) {
    return <h1>Loading...</h1>; // Simple loading message
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/Home/dashboard" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/Home" element={<HomePage />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="lowstock" element={<LowStockPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;