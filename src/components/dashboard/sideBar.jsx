import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MdDashboard,
    MdCategory,
    MdLocalShipping,
    MdInventory,
    MdAssessment,
    MdInventory2,
    MdMenu,
    MdAccountCircle
} from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import Logo from '../../assets/Logo.png';
import { fetchProducts } from '../../utils/productUtils/productApi';

const Sidebar = ({ onPageChange, currentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [lowStockCount, setLowStockCount] = useState(0);

    useEffect(() => {
        const getLowStockCount = async () => {
            try {
                const products = await fetchProducts();
                const lowStockItems = products.filter(product => product.quantity <= 50);
                setLowStockCount(lowStockItems.length);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        getLowStockCount();
    }, []);

    const handleSignOut = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard />, label: 'Dashboard' },
        { id: 'categories', icon: <MdCategory />, label: 'Categories' },
        { id: 'suppliers', icon: <MdLocalShipping />, label: 'Suppliers' },
        { id: 'products', icon: <MdInventory />, label: 'Products' },
        { id: 'lowstock', icon: <MdInventory2 />, label: 'Low Stock', count: lowStockCount },
    ];

    return (
        <>
            <div 
                className="d-lg-none position-fixed top-0 start-0 w-100 bg-white shadow-sm"
                style={{ 
                    height: '60px',
                    zIndex: 1
                }}
            >
                <div className="d-flex align-items-center justify-content-between h-100 px-3">
                    <div className="d-flex align-items-center">
                        <button 
                            className="btn btn-link text-dark p-0 border-0"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <MdMenu size={24} />
                        </button>
                        <span className="ms-3 fw-bold">CATalog</span>
                    </div>
                    <img 
                        src={Logo} 
                        alt="Company Logo" 
                        style={{ height: '40px' }}
                    />
                </div>
            </div>

            {isOpen && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
                    onClick={() => setIsOpen(false)}
                    style={{ zIndex: 1032 }}
                />
            )}

            <div 
                className={`d-flex flex-column flex-shrink-0 p-3 bg-white sidebar ${isOpen ? 'show' : ''}`}
                style={{ 
                    width: '240px', 
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 1033,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out'
                }}
            >
                <div className="position-relative mb-3 d-none d-lg-block">
                    <div className="d-flex justify-content-center">
                        <img 
                            src={Logo} 
                            alt="Company Logo" 
                            className="img-fluid"
                            style={{ maxWidth: '75px', height: 'auto' }}
                        />  
                    </div>
                </div>

                <hr className="d-none d-lg-block" />
                <ul className="nav nav-pills flex-column mb-auto">
                    {menuItems.map((item) => (
                        <li key={item.id} className="nav-item mb-2">
                            <button
                                className={`nav-link d-flex align-items-center gap-2 w-100 border-0 ${
                                    currentPage === item.id ? 'active' : 'link-dark'
                                }`}
                                onClick={() => {
                                    onPageChange(item.id);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="d-flex align-items-center position-relative">
                                    {React.cloneElement(item.icon, { size: 20 })}
                                    {item.count > 0 && item.id === 'lowstock' && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                                              style={{ backgroundColor: '#007bff', color: 'white' }}>
                                            {item.count}
                                        </span>
                                    )}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
                <hr />
                <div className="dropdown">
                    <a href="#" 
                        className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" 
                        id="dropdownUser" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <MdAccountCircle size={32} className="me-2 text-primary" /> 
                        <strong>{user || 'user'}</strong>
                    </a>
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser">
                        <li>
                            <button 
                                className="dropdown-item" 
                                onClick={() => onPageChange('profile')}
                            >
                                Profile
                            </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button 
                                className="dropdown-item" 
                                onClick={handleSignOut}
                            >
                                Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;