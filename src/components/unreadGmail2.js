import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import axios from 'axios';

function GmailIntegrate({ handleUnreadEmailCount }) {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthorization();
    }, []);

    const checkAuthorization = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/gmail/check-authorization', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthorized(response.data.isAuthorized);
            setLoading(false);
        } catch (error) {
            console.error('Error checking Gmail authorization:', error);
            setLoading(false);
        }
    };

    const initiateAuthorization = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/gmail/unread', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.url) {
                window.open(response.data.url, 'Gmail Integration', 'width=600,height=400');
            } else {
                window.location.reload(); 
            }
        } catch (error) {
            console.error('Error initiating Gmail integration:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    // Render only when user is not authorized
    if (!isAuthorized) {
        return (
            <Box textAlign="center">
                <Typography variant="body1">User not authorized. No unread messages can be shown.</Typography>
                <Button variant="outlined" onClick={initiateAuthorization}>Authorize Gmail</Button>
            </Box>
        );
    }

    // Render nothing when user is authorized
    return null;
}

export default GmailIntegrate;
