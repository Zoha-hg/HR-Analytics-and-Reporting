import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';
import companylogo from './assets/logo.png';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const HandleUserSignUp = async (event) => {
        event.preventDefault();
        console.log('SignUp attempt with', username, email, password, role);
        try {
            const response = await axios.post('https://hr-analytics-and-reporting-production.up.railway.app/signup', { username, email, password, role });
            // Handle success, redirect or set user state
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            // Handle error, display error message to the user
            alert(`SignUp failed: ${error.response.data.message}`);
        }
    };
    // // Checking password strength
    // const calculateStrength = ({password}) => {
    //     let strength = 0;
    //     if(password.length > 8) strength += 1;
    //     if(password.match(/[a-z]/)) strength += 1;
    //     if(password.match(/[A-Z]/)) strength += 1;
    //     if(password.match(/[0-9]/)) strength += 1;
    //     if(password.match(/[^a-zA-Z0-9]/)) strength += 1;
    //     return strength;
    // }
    // function getStrengthLevel(strength){
    //     switch(strength){
    //         case 0:
    //             return 'red';
    //         case 1:
    //             return 'orange';
    //         case 2:
    //             return 'yellow';
    //         case 3:
    //             return 'lightblue';
    //         case 4:
    //             return 'lightgreen';
    //         default:
    //             return 'grey';
    //     }
    // }
    // const strength = calculateStrength({password});
    // const strengthLevel = getStrengthLevel(strength);
    // const stregnthbarStyle = {
    //     width : `${(strength / 5) * 100}%`,
    //     backgroundColor: strengthLevel,
    //     filter: strength > 0 ? `drop-shadow(0 0 5px ${strengthLevel})` : `none`
    // }
          

    return (
        <div className="signup-container">
            <div className="signup-card">
                <header className="signup-header">
                    <a href="/">
                        <img src={companylogo} alt="DevSinc logo" className="company-logo"/>
                    </a>
                    <p>HR DATA DRIVE</p>
                </header>
                <section className="signup-form">
                    <h2>WELCOME!</h2>
                    <div className="sign-in">
                        Already have an account? <a href="/login">Sign in</a>

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
                            {/* <div className='strength-meter'>
                                <div className='strength-bar' style={stregnthbarStyle}></div>
                            </div>
                            <script>
                                
                            </script> */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                            >
                                <option value="">Select Role</option>
                                <option value="HR professional">HR professional</option>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
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
