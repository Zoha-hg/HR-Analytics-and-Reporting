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

  const HandleUserLogin = async (event) => {
      event.preventDefault();
      console.log('Login attempt with', username, password);
      try {
        const response = await axios.post('http://localhost:8000/login', { username, password });
        console.log('Response: ', response);
        if (response.status === 200) {
          // Login successful, navigate to dashboard with context
          // Context contains the response from server which in turn contains the user details from the user collection.
          const userContext = response.data
          navigate('/dashboard', { state: userContext });
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (error) {
        alert('Login failed. Please try again.');
      }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <img src={companylogo} alt="DevSinc logo"className="company-logo" />
          <p>HR DATA DRIVE</p>
        </header>
        <section className="login-form">
          <h2>WELCOME BACK!</h2>
          <div className="sign-up">
            Don’t have an account, <a href="/signup">Sign up</a>
          </div>
          <form onSubmit={HandleUserLogin}>
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
