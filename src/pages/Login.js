import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Lottie from 'lottie-react';
import cartoonPull from '../animation/WaitingMonster.json'; // Correct path to your animation
import { useAuth } from '../context/AuthContext'; // Ensure AuthContext is properly set up

function Login({ setUserRole }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure login from useAuth
    
    async function loginUser(event) {
        event.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            });


            const data = await response.json();
            console.log('Response Data:', data); // Debugging: Print response data

            if (response.ok && data.token) {
                // Store token and user info in AuthContext
                login({
                    token: data.token,
                    user: data.user,
                });

                // Update role in App.js via the setUserRole prop
                setUserRole(data.user.role);

                // Store user and token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on role
                if (data.user.role === 'admin') {
                    navigate('/admin-dashboard'); // Redirect to admin dashboard
                } else {
                    navigate('/user-dashboard'); // Redirect to user dashboard
                }
            } else {
                setErrorMessage(data.error || 'Invalid Username/Email or Password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    }

    const handleSignUp = () => {
        navigate('/register');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="animation-container">
                <Lottie
                    animationData={cartoonPull}
                    loop={true}
                    style={{ width: '300px', height: '300px', margin: '0 auto' }}
                />
            </div>

            <div className="login-card">
                <h1>Login</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
                <form onSubmit={loginUser}>
                    <input
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        type="text"
                        placeholder="Email or Username"
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
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div className="signup-container">
                    <button onClick={handleSignUp}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}


export default Login;
