import React, { useState } from 'react';
import axios from 'axios';
import './SignUpPage.css'; // Make sure to import the CSS file for styling
import companylogo from './assets/logo.png';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const HandleUserSignUp = async (event) => {
        event.preventDefault();
        console.log('SignUp attempt with', username, email, password, role);
        try {
            const response = await axios.post('http://localhost:8000/signup', { username, email, password, role });
            console.log('SignUp successful:', response.data);
            // Handle success, redirect or set user state
        } catch (error) {
            console.error('SignUp error:', error.response ? error.response.data : error.message);
            // Handle error, display error message to the user
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <header className="signup-header">
                    <img src={companylogo} alt="DevSinc logo" className="company-logo" />
                    <p>HR DATA DRIVE</p>
                </header>
                <section className="signup-form">
                    <h2>WELCOME!</h2>
                    <div className="sign-in">
                        Already have an account? <a href="#">Sign in</a>
                    </div>
                    <form onSubmit={HandleUserSignUp}>
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
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
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
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                // style={{
                                //     width: '100%',
                                //     padding: '.75em',
                                //     border: '1px solid #0c0c0c',
                                //     borderRadius: '100px',
                                //     fontSize: '1em',
                                //     fontFamily: 'Nunito, sans-serif',
                                //     backgroundColor: 'white',
                                // }}
                                >
                                <option value="">Select Role</option>
                                <option value="HR professional">HR professional</option>
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="sign-up-button">Sign Up</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SignUpPage;
