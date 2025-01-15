import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user')),
    });

    useEffect(() => {
        if (authState.token) {
            localStorage.setItem('token', authState.token);
        } else {
            localStorage.removeItem('token');
        }

        if (authState.user) {
            localStorage.setItem('user', JSON.stringify(authState.user));
        } else {
            localStorage.removeItem('user');
        }
    }, [authState]);

    const login = (data) => {
        setAuthState({
            token: data.token,
            user: data.user,
        });
    };

    const logout = () => {
        setAuthState({
            token: null,
            user: null,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
