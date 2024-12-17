import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BusinessSetupModal from '../components/business/businessSetupModal';
import Sidebar from '../components/dashboard/sideBar';
import DashboardPage from './dashboard';
import ProductPage from './product';
import CategoriesPage from './categories';
import LowStockPage from './lowstock';
import SuppliersPage from './supplier';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import BG from '../assets/stacked-waves-haikei.svg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import ProfilePage from './profilePage';
import { useTransition, animated, useSpringRef } from '@react-spring/web';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [showBusinessSetup, setShowBusinessSetup] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 992);
    
    const transRef = useSpringRef();
    const transitions = useTransition(location.pathname, {
        // comment everything here if you want to disable the animations //
        ref: transRef,
        keys: location.pathname,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
        config: {
            tension: 400,
            friction: 26,
            mass: 0.8,
            clamp: false,
            precision: 0.01
        },
        immediate: false,
        exitBeforeEnter: true
        // comment everything here if you want to disable the animations //
    });

    useEffect(() => {
        transRef.start();
    }, [location.pathname]);

    useEffect(() => {
        const token = Cookies.get('authToken'); 
        if (token) {
            const decodedToken = jwtDecode(token); 
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
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        const page = location.pathname.split('/')[2] || 'dashboard'; 
        switch (page) {
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
            case 'profile':
                return <ProfilePage />;
            default:
                navigate('/Home/dashboard'); 
                return null;
        }
    };

    return (
        <div className="d-flex" id='root' style={{overflow: 'hidden'}}>
            <Sidebar 
                onPageChange={(page) => navigate(`/Home/${page}`)} 
                currentPage={location.pathname.split('/')[2] || 'dashboard'} 
            />
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
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <div className="container-fluid px-0" style={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    height: '100vh'
                }}>
                    {transitions((style, item) => (
                        <animated.div
                            style={{
                                ...style,
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                willChange: 'transform, opacity',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            {renderContent()}
                        </animated.div>
                    ))}
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