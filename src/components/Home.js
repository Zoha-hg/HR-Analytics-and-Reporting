import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/signup">
                <button>SignUp</button>
            </Link>
            <Link to="/form">
                <button>Create a Form</button>
            </Link>
            <Link to="/fill">
                <button>Fill a Form</button>
            </Link>
            <Link to="/display">
                <button>Display Forms</button>
            </Link>
        </div>
    );
};
export default Home;
