import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = Cookies.get('authToken');
                if (token) {
                    updateToken(token);
                    setIsAuthenticated(true);
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                        setUser(JSON.parse(savedUser));
                    }
                    const savedBusiness = localStorage.getItem('business');
                    if (savedBusiness) {
                        setBusiness(JSON.parse(savedBusiness));
                    }
                }
            } catch (error) {
                removeToken();
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, []);

    const updateToken = (newToken) => {
        setToken(newToken);
        Cookies.set('authToken', newToken, { expires: 1 });
    };

    const removeToken = () => {
        Cookies.remove('authToken');
        setToken(null);
        setIsAuthenticated(false);
    };

    const updateBusiness = (data) => {
        setBusiness(data);
        localStorage.setItem('business', JSON.stringify(data));
    }

    const login = (userData, businessData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        updateBusiness(businessData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        removeToken();
        setToken(null);
        setIsAuthenticated(false);
    };

    const value = { token, isAuthenticated, loading, setIsAuthenticated, login, logout, user, business, updateBusiness };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };