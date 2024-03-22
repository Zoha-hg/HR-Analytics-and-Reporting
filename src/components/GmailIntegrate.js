import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

    function GmailIntegrate() {
        const navigate = useNavigate();
        const [popup, setPopup] = useState(null);
        const initiateAuthorization = () => {
            const newPopup = window.open('http://localhost:8000/start-gmail-authorization', 'Gmail Integration', 'width=600,height=400');
            setPopup(newPopup);
            console.log("Initiating Gmail Integration...");
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
