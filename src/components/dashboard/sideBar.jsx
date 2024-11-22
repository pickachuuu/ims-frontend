import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaChartBar, FaCog, FaBars, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Logo from '../../assets/Logo.png'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const { user, logout } = useContext(AuthContext);

const handleSignOut = () => {
    logout();
    const navigate = useNavigate();
    navigate('/Dashboard');
};

  return (
    <>
      <button 
        className="btn btn-primary d-lg-none position-fixed top-0 start-0 m-2" 
        onClick={toggleSidebar}
        style={{ zIndex: 1031 }}
      >
        <FaBars />
      </button>

      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          onClick={toggleSidebar}
          style={{ zIndex: 1032 }}
        />
      )}

      <div 
        className={`d-flex flex-column flex-shrink-0 p-3  sidebar ${isOpen ? 'show' : ''}`}
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
        <div className="position-relative mb-3">
            <div className="d-flex justify-content-center">
                <img 
                    src={Logo} 
                    alt="Company Logo" 
                    className="img-fluid"
                    style={{ maxWidth: '75px', height: 'auto' }}
                />  
            </div>
            <button 
                className="btn-close d-lg-none position-absolute top-50 end-0 translate-middle-y" 
                onClick={toggleSidebar}/>
        </div>


        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link active d-flex align-items-center gap-2" onClick={() => setIsOpen(false)}>
              <FaHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="nav-link link-dark d-flex align-items-center gap-2" onClick={() => setIsOpen(false)}>
              <FaBox /> Inventory
            </Link>
          </li>
          <li>
            <Link to="/users" className="nav-link link-dark d-flex align-items-center gap-2" onClick={() => setIsOpen(false)}>
              <FaUsers /> Products
            </Link>
          </li>
          <li>
            <Link to="/reports" className="nav-link link-dark d-flex align-items-center gap-2" onClick={() => setIsOpen(false)}>
              <FaChartBar /> Suppliers
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link link-dark d-flex align-items-center gap-2" onClick={() => setIsOpen(false)}>
              <FaCog /> Settings
            </Link>
          </li>
        </ul>
        <hr />
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" 
            id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
            <FaUserCircle size={32} className="me-2 text-primary" /> 
            <strong>{user || 'user'}</strong>
          </a>
          <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="/" onClick={handleSignOut}>Sign out</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;