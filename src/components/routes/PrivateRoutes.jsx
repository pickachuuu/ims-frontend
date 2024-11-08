import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const PrivateRoutes = () => {
  const {isAuthenticated} = useContext(AuthContext)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet/>
};

export default PrivateRoutes;
