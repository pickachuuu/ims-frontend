import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BusinessSetupModal from '../components/business/businessSetupModal';
import Sidebar from '../components/dashboard/sideBar';
import DashboardPage from './dashboard';
import ProductPage from './product';
import CategoriesPage from './categories';
import LowStockPage from './lowstock';
import SuppliersPage from './supplier';
import ReportsPage from './reports';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import BG from '../assets/curve.svg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [showBusinessSetup, setShowBusinessSetup] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const token = Cookies.get('authToken'); 
        if (token) {
            const decodedToken = jwtDecode(token); 
            console.log(decodedToken.businessID);
            if (!decodedToken.businessID) { 
                setShowBusinessSetup(true);
            }
        }
    }, [user]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
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
        <div className="d-flex" id='root' >
            <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
            <main 
                className="flex-grow-1" 
                style={{ 
                    marginLeft: isMobile ? '0' : '240px',
                    marginTop: isMobile ? '60px' : '0',
                    padding: '15px',
                    transition: 'all 0.3s ease-in-out',
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa',
                    backgroundImage: `url(${BG})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                }}
            >
                <div className="container-fluid px-0">
                    {renderContent()}
                </div>
            </main>
            <BusinessSetupModal 
                isOpen={showBusinessSetup} 
                onRequestClose={() => setShowBusinessSetup(false)}
            />
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
        </div>
    );
};

export default HomePage;