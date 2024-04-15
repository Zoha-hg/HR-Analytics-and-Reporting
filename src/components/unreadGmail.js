import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Button} from '@mui/material';
import axios from 'axios';

function GmailIntegrate() {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0); // State to store the count of unread messages
    const [messages, setMessages] = useState([]); // State to store the unread messages

    useEffect(() => {
        checkAuthorization();
    }, []);

    const fetchUnreadCount = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8000/api/gmail/unread-count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(response.data.unreadCount); // Set the unread count state with the fetched data
        } catch (error) {
            console.error('Error fetching unread message count:', error);
        }
    };

    const fetchUnreadMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/gmail/unread', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data); // Set the messages state with the fetched data
        } catch (error) {
            console.error('Error fetching unread messages:', error);
        }
    };

    const checkAuthorization = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/gmail/check-authorization', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthorized(response.data.isAuthorized);
            if (response.data.isAuthorized) {
                fetchUnreadMessages(); // Fetch unread messages if authorized
                fetchUnreadCount(); // Fetch unread message count if authorized
            }
            setLoading(false);
        } catch (error) {
            console.error('Error checking Gmail authorization:', error);
            setLoading(false);
        }
    };

    
    const initiateAuthorization = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/gmail/unread', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.url) {
                window.open(response.data.url, 'Gmail Integration', 'width=600,height=400');
            } else {
                navigate('/unread'); // Navigate to your unread messages route
                window.location.reload(); 
            }
        } catch (error) {
            console.error('Error initiating Gmail integration:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Box justifyContent={'center'}>
            {isAuthorized ? (
                <div>
                    <p>Gmail integration is set up.</p>
                    <p>You have {unreadCount} unread messages.</p> {/* Display the unread message count */}
                    <ul>
                        {messages.map((message, index) => (
                            <li key={index}>
                                <div><strong>From:</strong> {message.from}</div>
                                <div><strong>Subject:</strong> {message.subject}</div>
                                <div><strong>Date:</strong> {message.date}</div>
                                <div><strong>Snippet:</strong> {message.snippet}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <p>User not authorized. No unread messages can be shown.</p>
                    <Button variant='outlined' onClick={initiateAuthorization}>Authorize Gmail</Button>
                </div>
            )}
        </Box>
    );
}

export default GmailIntegrate;