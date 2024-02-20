import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Make sure to import the CSS file for styling
import companylogo from './assets/logo.png';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const HandleUserLogin = async (event) => {
        event.preventDefault();
        console.log('Login attempt with', username, password);
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password });
            console.log('Login successful:', response.data);
            // Handle success, redirect or set user state
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            // Handle error, display error message to the user
        }
    };

    return (

        <div className="login-container">
            <div className="login-card">
                <header className="login-header">
                    <img src={companylogo} alt="DevSinc logo" className="company-logo" />
                    <p>HR DATA DRIVE</p>
                </header>
                <section className="login-form">
                    <h2>WELCOME BACK!</h2>
                    <div className="sign-up">
                        Don’t have an account, <a href="#">Sign up</a>
                    </div>
                    <form onSubmit={HandleUserLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="rememberMe" hidden />
                                <label htmlFor="rememberMe" className="custom-checkbox-label">
                                    <span className="custom-checkbox"></span>
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                        <button type="submit" className="sign-in-button">Sign In</button>
                    </form>
                </section>
            </div>  

        </div>
    );
};

export default LoginPage;
