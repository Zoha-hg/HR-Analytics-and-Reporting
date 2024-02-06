

import React from 'react';
import './LoginPage1.css'; 
import companylogo from '../assets/logo.png';
              <input type="password"/>

const LoginPage = () => {
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
            Don’t have an account, <a href="#">Sign up</a>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="email" id="username" placeholder="mustafa@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
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
