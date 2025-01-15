import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('user'); // Default role to 'user'
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords

    async function registerUser(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt of 10

        try {
            const response = await fetch('http://localhost:1337/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password: hashedPassword, // Use hashedPassword instead of plain password
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || 'Registration failed. Please try again.');
                return;
            }

            if (data.status === 'ok') {
                if (role === 'admin') {
                    setSuccessMessage('Admin registration successful! You can now log in.');
                    setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
                } else  if (data.status === 'ok') {
                    setSuccessMessage('Registration successful! You can now log in.');
                    setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
                  }
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setErrorMessage('An error occurred during registration. Please try again.');
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const toggleRole = () => {
        setRole(role === 'user' ? 'admin' : 'user');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Register</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <form onSubmit={registerUser}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Full Name"
                        required
                    />
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Username"
                        required
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <div className="password-input">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                        />
                        <span onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    <div className="password-input">
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            required
                        />
                        <span onClick={toggleConfirmPasswordVisibility}>
                            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>

                    <div className="role-toggle">
                        <span>Role: {role === 'admin' ? 'Admin' : 'User'}</span>
                        <button type="button" onClick={toggleRole} className="toggle-btn">
                            Toggle to {role === 'admin' ? 'User' : 'Admin'}
                        </button>
                    </div>

                    <button type="submit">Register</button>
                    <p>
                        Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;