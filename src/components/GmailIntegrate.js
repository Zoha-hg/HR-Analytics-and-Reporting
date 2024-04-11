import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GmailIntegrate() {
    const navigate = useNavigate();
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        initiateAuthorization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initiateAuthorization = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                navigate('/login'); // Redirect to login if no token is found
                return;
            }
    
            const response = await axios.get('http://localhost:8000/start-gmail-authorization', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.data.url) {
                // If the server provides a URL, open the OAuth flow in a new window
                const newPopup = window.open(response.data.url, 'Gmail Integration', 'width=600,height=400');
                setPopup(newPopup);
            } else {
                // If there's no URL, assume authorization is complete
                navigate('/gmail-authorized'); // Redirect to the authorized-only page
            }
        } catch (error) {
            console.error('Error initiating Gmail integration:', error);
        }
    };
}

export default GmailIntegrate;
