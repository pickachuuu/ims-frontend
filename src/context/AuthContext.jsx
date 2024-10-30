import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
          try {
            const token = await Cookies.get('authToken');
            if (token){
              updateToken(token);
              setIsAuthenticated(true)
            }
          } catch {
            removeToken();
          }
        };
    
        fetchToken()
      }, []);
    

    const updateToken = (newToken) => {
        setToken(newToken);
        Cookies.set('authToken', newToken, { expires: 1 });
    };

    const removeToken = () => {
        Cookies.remove('authToken', { path: '/', });
        setToken(null);
        setIsAuthenticated(false);
    };

    const value = { token, isAuthenticated, setIsAuthenticated};

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};