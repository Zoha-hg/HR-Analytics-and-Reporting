import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import authorize from '../../backend/email-api/services/googleApiAuthService';

function GmailIntegrate() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/check-token-existence', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.hasToken) {
                // If a token exists, redirect to the Gmail page
                navigate('/gmail');
            } else {
                // If no token, initiate the authorization process
                initiateAuthorization();
            }
        })
        .catch(error => {
            console.error('Error checking token existence:', error);
        });
    }, [navigate]);

    const initiateAuthorization = () => {
        // This should point to your backend endpoint that starts the OAuth process
        // The backend should handle the OAuth flow and eventually redirect back to your app
        window.location.href = '/start-gmail-authorization';
    };

    return (
        <div>
            <h1>Initiating Gmail Integration...</h1>
            <p>Please wait while we check your authorization status and redirect you accordingly.</p>
        </div>
    );
}

export default GmailIntegrate;
