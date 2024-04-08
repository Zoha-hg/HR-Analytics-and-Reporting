import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to HR Data Drive</h1>
        <p>Your one-stop solution for HR analytics and reporting.</p>
      </header>
      <section className="home-content">
        <h3>Harness the power of data to optimize your workforce, improve decision-making, and drive success.</h3>
      </section>
      <section className="button-container">
        <Link to="/signup" className="sign-up-button">
          Sign Up
        </Link>
        <Link to="/login" className="login-button">
          Login
        </Link>
      </section>
      <footer className="home-footer">
        <p>&copy; 2024 Data Darbar</p>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
