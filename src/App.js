import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthContext
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Login from './pages/Login'; // Login Page
import Register from './pages/Register'; // Register Page
import AdminDashboard from './pages/AdminDashboard'; // Admin Dashboard
import UMDashboard from './pages/user-management/UMDashboard'; // User Management Dashboard
import CMDashboard from './pages/complaint-management/CMDashboard';
import UserDashboard from './pages/UserDashboard'; // User Dashboard (Import your user dashboard here)
import ComplaintForm from './pages/ComplaintForm'; // Import the Complaint Form

// Import ModalProvider and Modal component from modal folder
import { ModalProvider } from './modal/ModalContext'; 
import Modal from './modal/Modal'; 

function App() {
    const [userRole, setUserRole] = useState(null); // For managing user role (admin, user, etc.)

    return (
        <AuthProvider>
            {/* Wrap your app in ModalProvider */}
            <ModalProvider>
                <Router>
                    <Routes>
                        {/* Login Route */}
                        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

                        {/* Register Route */}
                        <Route path="/register" element={<Register />} />

                        {/* Admin Dashboard Route */}
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute role="admin" userRole={userRole}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* User Management Dashboard */}
                        <Route
                            path="/user-management"
                            element={
                                <ProtectedRoute role="admin">
                                    <UMDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Complaint Management Dashboard */}
                        <Route
                            path="/complaint-management"
                            element={
                                <ProtectedRoute role="admin" userRole={userRole}>
                                    <CMDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* User Dashboard (accessible to users) */}
                        <Route
                            path="/user-dashboard"
                            element={
                                <ProtectedRoute role="user" userRole={userRole}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Complaint Form (accessible to users) */}
                        <Route
                            path="/complaint-form"
                            element={
                                <ProtectedRoute role="user" userRole={userRole}>
                                    <ComplaintForm />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default Route or Catch All (Redirect to Login if no valid route) */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
                {/* Add Modal component to display modal globally */}
                <Modal />
            </ModalProvider>
        </AuthProvider>
    );
}

export default App;
