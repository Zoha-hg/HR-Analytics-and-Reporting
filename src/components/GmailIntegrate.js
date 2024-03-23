import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GmailIntegrate() {
    const navigate = useNavigate();
    const [popup, setPopup] = useState(null);

    const initiateAuthorization = async () => {
        try {
            // Assuming the token is stored in localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found');
                return;
            }

            // Send a request to the backend to initiate the OAuth process
            const response = await axios.get('http://localhost:8000/start-gmail-authorization', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Open a new popup window with the URL provided by the server
            const newPopup = window.open(response.data.url, 'Gmail Integration', 'width=600,height=400');
            setPopup(newPopup);
        } catch (error) {
            console.error('Error initiating Gmail integration:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div>
            <h1>Initiating Gmail Integration...</h1>
            <p>Please wait while we initiate Gmail Integration.</p>
            <button onClick={initiateAuthorization}>Initiate Integration</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default GmailIntegrate;
