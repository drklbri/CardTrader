// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            setIsAuthenticated(true);
            const decodedToken = jwtDecode(accessToken);
            setCurrentUser(decodedToken); // Сохраняем полный объект с данными пользователя
        } else {
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
        setIsLoading(false);
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('currentUser', currentUser)
        setIsAuthenticated(true);
        const decodedToken = jwtDecode(accessToken);
        setCurrentUser(decodedToken); // Сохраняем полный объект
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
