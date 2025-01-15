import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { authState } = useAuth();
    const isAuthenticated = authState.user && authState.token;

    // Get userRole from the authenticated user
    const userRole = authState.user ? authState.user.role : null;

    console.log("ProtectedRoute Debug: ", { isAuthenticated, role, userRole, authState });

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && role !== userRole) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
