import React, {useState} from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const HandleUserLogin = async (event) => {
        event.preventDefault();
        console.log('Login attempt with', username, password);
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password });
            console.log('Login successful:', response.data);

        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);

            
        }
    };
    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={HandleUserLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;