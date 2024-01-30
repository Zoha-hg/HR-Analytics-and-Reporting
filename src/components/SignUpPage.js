import React, {useState} from 'react';
import axios from 'axios';

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


        } catch (error) {
            console.error('SignUp error:', error.response ? error.response.data : error.message);

        }
    };
    return (
        <div>
            <h1>User Registration</h1>
            <form onSubmit={HandleUserSignUp}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
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
                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        value={role}
                        onChange={event => setRole(event.target.value)}
                    />
                </div>
                <button type="submit">SignUp</button>
            </form>
        </div>
    );
}

export default SignUpPage;