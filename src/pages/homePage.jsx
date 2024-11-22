import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/sideBar';
import DashboardPage from './dashboard';
import ProductPage from './product';
import CategoriesPage from './categories';
import LowStockPage from './lowstock';
import SuppliersPage from './supplier';
import ReportsPage from './reports';

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'products':
                return <ProductPage />;
            case 'categories':
                return <CategoriesPage />;
            case 'lowstock':
                return <LowStockPage />;
            case 'suppliers':
                return <SuppliersPage />;
            case 'reports':
                return <ReportsPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="d-flex">
            <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
            <main 
                className="flex-grow-1 p-3" 
                style={{ 
                    marginLeft: isMobile ? '0' : '240px',
                    transition: 'margin-left 0.3s ease-in-out',
                    width: '100%'
                }}
            >
                {renderContent()}
            </main>
        </div>
    );
};

export default HomePage;