import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaChartBar, FaCog } from 'react-icons/fa'; // Install react-icons if not already installed

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar" style={{ width: '280px', height: '100vh' }}>
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span className="fs-4">Your Logo</span>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link active d-flex align-items-center gap-2">
            <FaHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/inventory" className="nav-link link-dark d-flex align-items-center gap-2">
            <FaBox /> Inventory
          </Link>
        </li>
        <li>
          <Link to="/users" className="nav-link link-dark d-flex align-items-center gap-2">
            <FaUsers /> Users
          </Link>
        </li>
        <li>
          <Link to="/reports" className="nav-link link-dark d-flex align-items-center gap-2">
            <FaChartBar /> Reports
          </Link>
        </li>
        <li>
          <Link to="/settings" className="nav-link link-dark d-flex align-items-center gap-2">
            <FaCog /> Settings
          </Link>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" 
           id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>Username</strong>
        </a>
        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser">
          <li><a className="dropdown-item" href="#">Profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;