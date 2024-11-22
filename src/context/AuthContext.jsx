import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
          try {
            const token = await Cookies.get('authToken');
            if (token){
              updateToken(token);
              setIsAuthenticated(true)
              const savedUser = localStorage.getItem('user');
              if (savedUser) {
                setUser(JSON.parse(savedUser));
              }
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

    const login = (userData) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    };
  
    const logout = () => {
      // Clear user data
      setUser(null);
      localStorage.removeItem('user');
      
      // Clear token and auth state
      Cookies.remove('authToken', { path: '/', });
      setToken(null);
      setIsAuthenticated(false);
    };


    const value = { token, isAuthenticated, setIsAuthenticated, login, logout, user };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};