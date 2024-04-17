import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import companylogo from './assets/logo.png';
              <input type="password"/>

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUserLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', { username, password });
      console.log('Login response:', response);
      if (response.data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);
        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        alert('Login failed. Please check your username and password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <a href="/">
            <img src={companylogo} alt="DevSinc logo" className="company-logo"/>
          </a>
          <p>HR DATA DRIVE</p>
        </header>
        <section className="login-form">
          <h2>WELCOME BACK!</h2>
          <div className="sign-up">
            Don’t have an account, <a href="/signup">Sign up</a>
          </div>
          <form onSubmit={handleUserLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input 
                type="text" 
                id="username" 
                placeholder="mustafa@gmail.com" 
                value={username}
                onChange={event => setUsername(event.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={event => setPassword(event.target.value)}/>
            </div>
              <button type="submit" className="sign-in-button">Sign In</button>
            {/* <div className="form-options"> */}
            {/* <div className="remember-me">
                <input type="checkbox" id="rememberMe" hidden />
                <label htmlFor="rememberMe" className="custom-checkbox-label">
                  <span className="custom-checkbox"></span>
                  Remember me
                </label>
              </div> */}
              {/* <a href="#" className="forgot-password">Forgot password?</a> */}
            {/* </div> */}
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;